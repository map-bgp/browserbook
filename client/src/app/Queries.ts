import { ethers } from 'ethers'
import { Token, TokenContract, TokenType } from './Types'
import { ContractName } from './chain/ContractMetadata'
import { EtherContractWrapper, EtherStore } from './chain/EtherStore'

// This file is a mix of direct queries and event log queries

export const queryTokenContractEvent = async (ownerAddress: string) => {
  const filterName = 'TokenContractCreated'

  const contract = await new EtherContractWrapper().getContract(ContractName.TokenFactory)
  const filter = EtherStore.getFilter(contract, filterName, [ownerAddress])
  const queryResult = await EtherStore.queryFilter(contract, filter)

  const tokenFactoryEvent = queryResult
    .filter((e) => typeof e !== undefined)
    .filter((e) => e.args !== undefined)
    .shift()

  if (!!tokenFactoryEvent && !!tokenFactoryEvent.args) {
    return { uri: tokenFactoryEvent.args[1], address: tokenFactoryEvent.args[2] }
  } else {
    return null
  }
}

export const queryTokens = async (contractAddress: string) => {
  const contract = await new EtherContractWrapper().getContract(ContractName.Token, contractAddress)

  let tokens: Array<Token> = []
  const tokenNonce = await contract.tokenNonce().then((r: ethers.BigNumber) => r.toNumber())

  for (let i = 1; i < tokenNonce + 1; i++) {
    const tokenName = await contract.tokenNames(i)
    const tokenMetadataURI = await contract.tokenMetadata(i)
    const tokenSupply = ethers.utils.formatEther(String(await contract.tokenSupply(i)))
    const isNonFungible = await contract.isNonFungible(i)

    const token: Token = {
      id: i.toString(),
      name: tokenName,
      metadataURI: tokenMetadataURI,
      supply: tokenSupply,
      type: isNonFungible ? TokenType.NonFungible : TokenType.Fungible,
    }

    tokens.push(token)
  }

  return tokens
}
