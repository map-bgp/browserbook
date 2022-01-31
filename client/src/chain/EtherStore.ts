import { ethers } from 'ethers'

import { store } from '../app/store/Store'
import { selectEncryptionKey, setAccounts, setEncryptionKey } from '../app/store/slices/EthersSlice'
import { setEncryptedSignerKey } from '../app/store/slices/SignerSlice'
import { ContractMetadata, ContractName } from './ContractMetadata'
import { encrypt } from './Encryption'

const { ethereum } = window as any

const dispatch = store.dispatch

export class EtherStore {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner

  constructor() {
    if (typeof ethereum === 'undefined') {
      throw new Error('Ethereum object is not injected')
    } else {
      this.provider = new ethers.providers.Web3Provider(ethereum, 'any')
      this.signer = this.provider.getSigner()

      // If user has locked/logout from MetaMask, this resets the accounts array to empty
      ethereum.on('accountsChanged', (accounts: Array<string>) => dispatch(setAccounts(accounts)))
    }
  }

  connect = async () => await this.provider.send('eth_requestAccounts', [])

  getSigner = () => this.signer
  getAccounts = async () => await this.provider.listAccounts()
  getContract = async (contract: ContractName) => {
    const address = ContractMetadata[contract].address
    const contractABI = ContractMetadata[contract].abi

    return new ethers.Contract(address, contractABI, this.signer)
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
    callback: (events: Array<ethers.Event>) => void,
  ): Promise<void> => {
    if (contract === null) {
      throw new Error('Cannot set handler on null contract')
    }
    const queryFilter = async () => {
      const res = await EtherStore.queryFilter(contract, filter)
      console.log('Result of nested query:', res)
      callback(res)
    }

    contract.on(filter, () => queryFilter())
  }

  // TODO Don't forget to reset this somewhere when needed
  getEncryptionKey = async (account: string): Promise<string> => {
    if (account === '') {
      throw new Error('Malformed account')
    }

    if (selectEncryptionKey(store.getState()) === null) {
      const encryptionKey = await this.provider.send('eth_getEncryptionPublicKey', [account])

      dispatch(setEncryptionKey(encryptionKey))
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
