import { ethers } from "ethers"

// import {bufferToHex} from "ethereumjs-util";
import {encrypt} from "eth-sig-util";

import { store } from "../store/Store";
import {setAccounts} from "../store/slices/EthersSlice";
import {ContractName, ContractMetadata} from "./ContractMetadata";

const { ethereum } = window as any
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

  getPublicKey = async (accounts: Array<string>, onlyFirst: boolean = true) => {
    if (this.provider) {
      const accountsToRequest = onlyFirst ? [accounts[0]] : accounts
      return await this.provider.send('eth_getEncryptionPublicKey', accountsToRequest)
    } else {
      return null
    }
  }

  encryptDelegatedSigner = async (encryptionKey: string) => {
    const { address, privateKey } = ethers.Wallet.createRandom()

    const cipherText = address;

    // Throws error in the browser
    // const cipherText = bufferToHex(
    //   Buffer.from(
    //     JSON.stringify(
    //       encrypt(
    //         encryptionKey,
    //         { data: privateKey },
    //         "x25519-xsalsa20-poly1305"
    //       )
    //     ),
    //     "utf8"
    //   )
    // )

    return [cipherText, address]
  }

  getContract = async (contract: ContractName) => {
    if(this.provider) {
      const address = ContractMetadata[contract].address
      const contractABI = ContractMetadata[contract].abi
      const signer = await this.getSigner()

      return new ethers.Contract(address, contractABI, signer!)
    } else {
      return null; // Way to improve this?
    }
  }
}