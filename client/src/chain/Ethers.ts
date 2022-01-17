import { ethers } from "ethers"
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

  // getPublicKey = async () => {
  //   if (this.isConnected()) {
  //     return await this.provider!.send('eth_getEncryptionPublicKey',[this.accounts[0]])
  //   } else {
  //     return null
  //   }
  // }

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