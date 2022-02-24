import { ethers as ethersLib } from 'ethers'
import { ContractMetadata, ContractName } from '../chain/ContractMetadata'
import { EtherContractWrapper } from '../chain/EtherStore'
import { hasOwnProperty } from '../chain/helpers'
import { CreateTokenOptions, Token, TokenType, TransferTokenOptions } from '../Types'

export const createTokenContract = async (uri: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.TokenFactory
  const contract = await wrapper.getContract(contractName)

  const tx = await contract.create(uri)
  await tx.wait()
}

export const setExchangeApprovalForTokenContract = async (
  callerAddress: string,
  contractAddress: string,
) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Token
  const contract = await wrapper.getContract(contractName, contractAddress)

  const approvalContractName = ContractName.Exchange
  const approvalContractMetadata = ContractMetadata[approvalContractName]

  if (hasOwnProperty(approvalContractMetadata, 'address')) {
    const approvalAddress = approvalContractMetadata.address

    const isApprovedForAll = await contract.isApprovedForAll(callerAddress, approvalAddress)

    if (!isApprovedForAll) {
      const tx = await contract.setApprovalForAll(approvalAddress, true)
      await tx.wait()
    }
  }
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

export const depositDividend = async (amount: string, contractAddress: string, tokenId: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Token
  const contract = await wrapper.getContract(contractName, contractAddress)

  const tx = await contract.provideDividend(tokenId.toString(), {
    value: ethersLib.utils.parseEther(amount),
  })
  await tx.wait()
}

export const withdrawDividend = async (contractAddress: string, tokenId: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Token
  const contract = await wrapper.getContract(contractName, contractAddress)

  const tx = await contract.dividendClaim(tokenId.toString())
  await tx.wait()
}

export const depositEther = async (amount: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Exchange
  const contract = await wrapper.getContract(contractName)

  const tx = await contract.depositEther({
    value: ethersLib.utils.parseEther(amount),
  })
  await tx.wait()
}

export const withdrawEther = async (amount: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.Exchange
  const contract = await wrapper.getContract(contractName)

  const tx = await contract.withdrawEther()
  await tx.wait()
}
