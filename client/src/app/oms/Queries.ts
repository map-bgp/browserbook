import { ethers as ethersLib } from 'ethers'
import { Token, TokenType } from '../Types'
import { ContractName } from '../chain/ContractMetadata'
import { EtherContractWrapper, EtherStore } from '../chain/EtherStore'
import { db } from '../store/globals/db'

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

export const queryTokens = async (accountAddress: string, contractAddress: string) => {
  const contract = await new EtherContractWrapper().getContract(ContractName.Token, contractAddress)
  const contractURI = await contract.contractURI()

  let tokens: Array<Token> = []
  const tokenNonce = await contract.tokenNonce().then((r: ethersLib.BigNumber) => r.toNumber())

  for (let i = 1; i < tokenNonce + 1; i++) {
    const tokenName = await contract.tokenNames(i)
    const tokenMetadataURI = await contract.tokenMetadata(i)
    const tokenSupply = ethersLib.utils.formatEther(String(await contract.tokenSupply(i)))
    const isNonFungible = await contract.isNonFungible(i)
    const holdings = ethersLib.utils.formatEther(String(await contract.balanceOf(accountAddress, i)))

    const token: Token = {
      contract: {
        uri: contractURI,
        address: contractAddress,
      },
      id: i.toString(),
      own: true,
      name: tokenName,
      metadataURI: tokenMetadataURI,
      supply: tokenSupply,
      type: isNonFungible ? TokenType.NonFungible : TokenType.Fungible,
      holdings: holdings,
    }

    tokens.push(token)
  }

  return tokens
}

// We can't access the peer or the EtherStore, both have to be initialized by the store, which calls this files
// So here we sparingly use raw DB queries
export const queryImportedTokens = async (accountAddress: string) => {
  let tokens: Array<Token> = []
  const importedTokens = await db.tokens.toArray()

  for (const importedToken of importedTokens) {
    const contract = await new EtherContractWrapper().getContract(
      ContractName.Token,
      importedToken.contractAddress,
    )
    const contractURI = await contract.contractURI()

    const tokenName = await contract.tokenNames(importedToken.tokenId)
    const tokenMetadataURI = await contract.tokenMetadata(importedToken.tokenId)
    const tokenSupply = ethersLib.utils.formatEther(
      String(await contract.tokenSupply(importedToken.tokenId)),
    )
    const isNonFungible = await contract.isNonFungible(importedToken.tokenId)
    const holdings = ethersLib.utils.formatEther(
      String(await contract.balanceOf(accountAddress, importedToken.tokenId)),
    )

    const token: Token = {
      contract: {
        uri: contractURI,
        address: importedToken.contractAddress,
      },
      own: false,
      id: importedToken.tokenId.toString(),
      name: tokenName,
      metadataURI: tokenMetadataURI,
      supply: tokenSupply,
      type: isNonFungible ? TokenType.NonFungible : TokenType.Fungible,
      holdings: holdings,
    }

    tokens.push(token)
  }

  return tokens
}
