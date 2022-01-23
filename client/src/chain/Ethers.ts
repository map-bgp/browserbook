import {ethers} from "ethers"

import {store} from "../store/Store";
import {setAccounts} from "../store/slices/EthersSlice";
import {ContractMetadata, ContractName} from "./ContractMetadata";
import {encrypt} from "./Encryption";

const {ethereum} = window as any
const dispatch = store.dispatch

export class EtherStore {
  provider: ethers.providers.Web3Provider | null = null;
  signer: ethers.providers.JsonRpcSigner | null = null;

  constructor() {
    this.provider = typeof ethereum !== "undefined" ? new ethers.providers.Web3Provider(ethereum, "any") : null

    if (this.provider !== null) {
      ethereum.on("accountsChanged", (accounts: Array<string>) => {
        // If user has locked/logout from MetaMask, this resets the accounts array to empty
        dispatch(setAccounts(accounts))
      })
    }
  }

  // isConnected = () => this.provider && this.signer && this.accounts.length
  getAccounts = async () => this.provider ? await this.provider.listAccounts() : []
  getSigner = () => this.provider ? this.provider.getSigner() : null

  connect = async () => {
    if (this.provider) {
      await this.provider.send("eth_requestAccounts", [])
    }
  }

  // TODO Read from REDUX Store
  getPublicKey = async (accounts: Array<string>, onlyFirst: boolean = true): Promise<string> => {
    if (this.provider && accounts.length !== 0) {
      const accountsToRequest = onlyFirst ? [accounts[0]] : accounts
      return await this.provider.send('eth_getEncryptionPublicKey', accountsToRequest)
    } else {
      throw new Error("No accounts defined")
    }
  }

  encryptDelegatedSigner = async (encryptionKey: string) => {
    const {address, privateKey} = ethers.Wallet.createRandom()

    const cipherText = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(
        JSON.stringify(encrypt(
          {
            publicKey: encryptionKey,
            data: privateKey,
            version: "x25519-xsalsa20-poly1305",
          })
        )))

    return [cipherText, address]
  }

  decrypt = async (cipherText: string, address: string) => {
    if (this.provider) {
      return await this.provider.send("eth_decrypt", [cipherText, address]);
    } else {
      throw new Error("Metamask provider is null")
    }
  }

  getContract = async (contract: ContractName) => {
    if (this.provider) {
      const address = ContractMetadata[contract].address
      const contractABI = ContractMetadata[contract].abi
      const signer = await this.getSigner()

      return new ethers.Contract(address, contractABI, signer!)
    } else {
      throw new Error("Metamask provider is null")
    }
  }
}