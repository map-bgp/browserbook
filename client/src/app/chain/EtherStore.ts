import { ethers } from 'ethers'

import { store } from '../store/Store'
import { ethersSlice, selectEncryptionKey, setAccounts, setEncryptionKey } from '../store/slices/EthersSlice'
import { setEncryptedSignerKey } from '../store/slices/ValidatorSlice'
import { ContractName, ContractMetadata } from './ContractMetadata'
import { encrypt } from './Encryption'

const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop)
}

const { ethereum } = window as any

// A thin wrapper class that doesn't call any store methods
// We avoid the circular scope problems this way
export class EtherContractWrapper {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner

  constructor() {
    if (typeof ethereum === 'undefined') {
      throw new Error('Ethereum object is not injected')
    } else {
      this.provider = new ethers.providers.Web3Provider(ethereum, 'any')
      this.signer = this.provider.getSigner()
    }
  }

  getContract = async (contract: ContractName, address?: string) => {
    const contractMetadata = ContractMetadata[contract]

    if (hasOwnProperty(contractMetadata, 'address')) {
      const address = contractMetadata.address
      const contractABI = contractMetadata.abi

      return new ethers.Contract(address, contractABI, this.signer)
    } else {
      if (address === undefined) {
        throw new Error('Cannot call variable address contract without providing an address parameter')
      }

      const contractABI = contractMetadata.abi
      return new ethers.Contract(address, contractABI, this.signer)
    }
  }

  getEncryptionKey = async (account: string): Promise<string> => {
    if (account === '') {
      throw new Error('Malformed account')
    }

    return await this.provider.send('eth_getEncryptionPublicKey', [account])
  }

  encryptDelegatedSigner = async (account: string) => {
    const encryptionKey = await this.getEncryptionKey(account)
    const { address: signerAddress, privateKey } = ethers.Wallet.createRandom()

    const encryptedSignerKey = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(
        JSON.stringify(
          encrypt({
            publicKey: encryptionKey,
            data: privateKey,
            version: 'x25519-xsalsa20-poly1305',
          }),
        ),
      ),
    )

    return [signerAddress, encryptedSignerKey]
  }

  decrypt = async (cipherText: string, address: string) =>
  await this.provider.send('eth_decrypt', [cipherText, address])

  getDelegatedExchangeSigner = async (account: string, encryptedSignerKey: string): Promise<ethers.Contract> => {
    if (account === '') {
      throw new Error('Malformed account')
    }

    if (encryptedSignerKey === '') {
      throw new Error('Malformed encrypted signer key')
    }

    const signer = new ethers.Wallet(await this.decrypt(encryptedSignerKey, account))
    const contractMetadata = ContractMetadata[ContractName.Exchange]
    
    if (hasOwnProperty(contractMetadata, 'address')) {
      const address = contractMetadata.address
      const contractABI = contractMetadata.abi

      return new ethers.Contract(address, contractABI, signer)
    } else {
      throw new Error('Could not get address of exchange contract')
    }
  }
}

export class EtherStore {
  dispatch = store.dispatch
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner

  constructor() {
    if (typeof ethereum === 'undefined') {
      throw new Error('Ethereum object is not injected')
    } else {
      this.provider = new ethers.providers.Web3Provider(ethereum, 'any')
      this.signer = this.provider.getSigner()

      // If user has locked/logout from MetaMask, this resets the accounts array to empty
      ethereum.on('accountsChanged', (accounts: Array<string>) => this.dispatch(setAccounts(accounts)))
    }
  }

  connect = async () => await this.provider.send('eth_requestAccounts', [])

  getProvider = () => this.provider
  getSigner = () => this.signer
  getAccounts = async () => await this.provider.listAccounts()

  getContract = async (contract: ContractName, address?: string) => {
    const contractMetadata = ContractMetadata[contract]

    if (hasOwnProperty(contractMetadata, 'address')) {
      const address = contractMetadata.address
      const contractABI = contractMetadata.abi

      return new ethers.Contract(address, contractABI, this.signer)
    } else {
      if (address === undefined) {
        throw new Error('Cannot call variable address contract without providing an address parameter')
      }

      const contractABI = contractMetadata.abi
      return new ethers.Contract(address, contractABI, this.signer)
    }
  }

  static getFilter = (
    contract: ethers.Contract,
    filterName: string,
    args: Array<string>,
  ): ethers.EventFilter => {
    if (!Reflect.ownKeys(contract.filters).includes(filterName)) {
      throw new Error('Filter not present on contract')
    }

    return contract.filters[filterName](...args)
  }

  static queryFilter = async (
    contract: ethers.Contract,
    filter: ethers.EventFilter,
  ): Promise<Array<ethers.Event>> => {
    if (contract === null) {
      throw new Error('Cannot query filters on null contract')
    }

    return await contract.queryFilter(filter)
  }

  static setFilterHandler = async (
    contract: ethers.Contract,
    filter: ethers.EventFilter,
    callback: () => void,
  ): Promise<void> => {
    if (contract === null) {
      throw new Error('Cannot set handler on null contract')
    }
    contract.on(filter, () => callback())
  }

  // TODO Don't forget to reset this somewhere when needed
  getEncryptionKey = async (account: string): Promise<string> => {
    if (account === '') {
      throw new Error('Malformed account')
    }

    if (selectEncryptionKey(store.getState()) === null) {
      const encryptionKey = await this.provider.send('eth_getEncryptionPublicKey', [account])

      this.dispatch(setEncryptionKey(encryptionKey))
      return encryptionKey
    } else {
      return selectEncryptionKey(store.getState())!
    }
  }

  encryptDelegatedSigner = async (account: string) => {
    const encryptionKey = await this.getEncryptionKey(account)
    const { address: signerAddress, privateKey } = ethers.Wallet.createRandom()

    const encryptedSignerKey = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(
        JSON.stringify(
          encrypt({
            publicKey: encryptionKey,
            data: privateKey,
            version: 'x25519-xsalsa20-poly1305',
          }),
        ),
      ),
    )

    return [signerAddress, encryptedSignerKey]
  }

  decrypt = async (cipherText: string, address: string) =>
    await this.provider.send('eth_decrypt', [cipherText, address])
}
