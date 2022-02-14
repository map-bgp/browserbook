import { ethers as ethersLib } from 'ethers'
import { ContractName } from '../chain/ContractMetadata'
import { EtherContractWrapper } from '../chain/EtherStore'

export const createAndLoadEncryptedSigner = async (
  primaryAccount: string | null,
  etherDeposit: string,
) => {
  if (primaryAccount === null) {
    throw new Error('Cannot retrieve encryption key from empty account')
  }
  const wrapper = new EtherContractWrapper()
  const signer = wrapper.signer

  const contractName = ContractName.Exchange
  const contract = await wrapper.getContract(contractName)

  const currentSigner = await contract.signerAddresses(primaryAccount)
  if (currentSigner !== ethersLib.constants.AddressZero) {
    throw new Error(
      'Careful. You are trying to initialize a new encrypted signer when one already exists. ' +
        "Doing so will erase the original signer's funds permanently.",
    )
  }

  const [signerAddress, encryptedSignerKey] = await wrapper.encryptDelegatedSigner(primaryAccount)

  // Set the signer information
  const tx = await contract.setSigner(signerAddress, encryptedSignerKey)
  await tx.wait()

  // Transfer the initial balance
  const transfer = await signer.sendTransaction({
    to: signerAddress,
    value: ethersLib.utils.parseEther(etherDeposit),
  })
  await transfer.wait()
}
