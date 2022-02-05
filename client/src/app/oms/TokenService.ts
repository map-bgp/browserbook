import { BigNumber, ethers as ethersLib, FixedNumber } from 'ethers'
import { ethers } from '../store/globals/ethers'
import { peer } from '../store/globals/peer'
import { ContractName } from '../chain/ContractMetadata'
import { selectAccountData } from '../store/slices/EthersSlice'
import { store } from '../store/Store'
import { Token, TokenType } from '../Types'

const dispatch = store.dispatch

export const createTokenContract = async (uri: string) => {
  const contractName = ContractName.TokenFactory
  const contract = await ethers.getContract(contractName)

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
  const contract = await ethers.getContract(contractName, contractAddress)

  if (tokenType === TokenType.Fungible) {
    await contract.fungibleMint(
      tokenIdentifier,
      ethersLib.utils.parseEther(tokenSupply),
      tokenMetadataURI,
      ethersLib.utils.toUtf8Bytes(''),
    )
  } else {
    await contract.nonFungibleMint(tokenIdentifier, tokenMetadataURI, ethersLib.utils.toUtf8Bytes(''))
  }
}

export const transferToken = async (
  contractAddress: string,
  recipientAddress: string,
  token: Token,
  quantity: string,
) => {
  const contractName = ContractName.Token
  const contract = await ethers.getContract(contractName, contractAddress)

  const senderAddress = selectAccountData(store.getState()).primaryAccount
  const tokenId = token.id
  const amount = ethersLib.utils.parseEther(quantity)

  if (!!senderAddress) {
    await contract.safeTransferFrom(
      senderAddress,
      recipientAddress,
      tokenId,
      amount,
      ethersLib.utils.toUtf8Bytes(''),
    )
  }
}

export const importToken = async (uri: string, tokenId: number) => {
  const factoryContractName = ContractName.TokenFactory
  const factoryContract = await ethers.getContract(factoryContractName)
  const tokenContractAddress = await factoryContract.tokenAddress(uri)

  if (tokenContractAddress === ethersLib.constants.AddressZero) {
    throw new Error('Token contract from uri not found')
  }

  const importedToken = {
    uri: uri,
    contractAddress: tokenContractAddress,
    tokenId: tokenId,
  }

  await peer.addToken(importedToken)
}
