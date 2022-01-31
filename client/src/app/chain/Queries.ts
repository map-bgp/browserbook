import { Token, TokenType } from '../Types'
import { ContractName } from './ContractMetadata'
import { EtherContractWrapper } from './EtherStore'

export const queryToken = async (id: string, contractAddress: string) => {
  const contractName = ContractName.Token

  const contract = await new EtherContractWrapper().getContract(contractName, contractAddress)
  const tokenName = await contract.tokenNames(id)
  const tokenMetadataURI = await contract.tokenMetadata(id)
  const tokenSupply = String(await contract.tokenSupply(id))
  const isNonFungible = await contract.isNonFungible(id)

  const token: Token = {
    id: id,
    name: tokenName,
    metadataURI: tokenMetadataURI,
    supply: tokenSupply,
    type: isNonFungible ? TokenType.NonFungible : TokenType.Fungible,
  }

  return token
}
