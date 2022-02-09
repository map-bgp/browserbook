import { ethers as ethersLib } from 'ethers'
import { ethers } from '../store/globals/ethers'
import { peer } from '../store/globals/peer'
import { ContractName } from '../chain/ContractMetadata'

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
