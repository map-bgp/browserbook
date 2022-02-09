import { ethers as ethersLib } from 'ethers'
import { ContractName } from '../chain/ContractMetadata'
import { EtherContractWrapper } from '../chain/EtherStore'
import { CreateTokenOptions, Token, TokenType, TransferTokenOptions } from '../Types'

export const createTokenContract = async (uri: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.TokenFactory
  const contract = await wrapper.getContract(contractName)

  const tx = await contract.create(uri)
  await tx.wait()
}

export const createToken = async (options: CreateTokenOptions) => {
  const { contractAddress, tokenIdentifier, tokenType, tokenSupply, tokenMetadataURI } = options
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Token
  const contract = await wrapper.getContract(contractName, contractAddress)

  if (tokenType === TokenType.Fungible) {
    const tx = await contract.fungibleMint(
      tokenIdentifier,
      ethersLib.utils.parseEther(tokenSupply),
      tokenMetadataURI,
      ethersLib.utils.toUtf8Bytes(''),
    )
    await tx.wait()
  } else {
    const tx = await contract.nonFungibleMint(
      tokenIdentifier,
      tokenMetadataURI,
      ethersLib.utils.toUtf8Bytes(''),
    )
    await tx.wait()
  }
}

export const transferToken = async (options: TransferTokenOptions) => {
  const { contractAddress, token, quantity, senderAddress, recipientAddress } = options
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Token
  const contract = await wrapper.getContract(contractName, contractAddress)

  const tokenId = token.id
  const amount = ethersLib.utils.parseEther(quantity)

  const tx = await contract.safeTransferFrom(
    senderAddress,
    recipientAddress,
    tokenId,
    amount,
    ethersLib.utils.toUtf8Bytes(''),
  )

  await tx.wait()
}
