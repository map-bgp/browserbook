import { ContractName } from '../chain/ContractMetadata'
import { EtherContractWrapper } from '../chain/EtherStore'

export const createTokenContract = async (uri: string) => {
  const wrapper = new EtherContractWrapper()

  const contractName = ContractName.TokenFactory
  const contract = await wrapper.getContract(contractName)

  const tx = await contract.create(uri)
  await tx.wait()
}
