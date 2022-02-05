import { BigNumber, ethers, FixedNumber } from 'ethers'
import Globals from '../../app/Globals'
import { ContractName } from '../chain/ContractMetadata'
import { selectAccountData } from '../store/slices/EthersSlice'
import { store } from '../store/Store'
import { Token, TokenType } from '../Types'

export const createTokenContract = async (uri: string) => {
  const contractName = ContractName.TokenFactory
  const contract = await Globals.ethers.getContract(contractName)

  await contract.create(uri)
}

export const createToken = async (
  contractAddress: string,
  tokenType: TokenType,
  tokenSupply: string,
  tokenIdentifier: string,
  tokenMetadataURI: string,
) => {
  const contractName = ContractName.Token
  const contract = await Globals.ethers.getContract(contractName, contractAddress)

  if (tokenType === TokenType.Fungible) {
    await contract.fungibleMint(
      tokenIdentifier,
      ethers.utils.parseEther(tokenSupply),
      tokenMetadataURI,
      ethers.utils.toUtf8Bytes(''),
    )
  } else {
    await contract.nonFungibleMint(tokenIdentifier, tokenMetadataURI, ethers.utils.toUtf8Bytes(''))
  }
}

export const transferToken = async (
  contractAddress: string,
  recipientAddress: string,
  token: Token,
  quantity: string,
) => {
  const contractName = ContractName.Token
  const contract = await Globals.ethers.getContract(contractName, contractAddress)

  const senderAddress = selectAccountData(store.getState()).primaryAccount
  const tokenId = token.id
  const amount = ethers.utils.parseEther(quantity)

  if (!!senderAddress) {
    contract.safeTransferFrom(
      senderAddress,
      recipientAddress,
      tokenId,
      amount,
      ethers.utils.toUtf8Bytes(''),
    )
  }
}
