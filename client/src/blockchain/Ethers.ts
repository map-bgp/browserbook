import {fetchABI} from "./abiFetcher";
import {ethers} from "ethers";
import {useAppDispatch} from "../store/Hooks";
import {setEthersAddress, setEthersConnected} from "../store/slices/EthersSlice";
import {store} from "../store/Store";
import {injected} from "./connectors";
import {TokenMetadata} from "./browser_abi/abi";

const { ethereum } = (window as any);
const dispatch = store.dispatch;

export class EtherStore {
    provider: ethers.providers.Web3Provider;

    constructor() {
        this.start().then(() => console.log("Successfully initialized ethers context"))
        this.isConnected().then(() => console.log("Ethers has successfully completed connection checks"))
    }

    async start() {
        if (typeof ethereum !== 'undefined') {
            this.provider = new ethers.providers.Web3Provider(ethereum, "any");

            if (this.provider !== null) {
                ethereum.on('accountsChanged', (accounts: Array<string>) => {
                    // If user has locked/logout from MetaMask, this resets the accounts array to empty
                    if (!accounts.length) {
                        dispatch(setEthersConnected(false))
                        dispatch(setEthersAddress(null))
                    } else {
                        dispatch(setEthersConnected(true))
                        dispatch(setEthersAddress(accounts[0]))
                    }
                });
            }

            return this.provider;
        }
        else {
            console.log("Install MetaMask")
            throw new Error("Please install the Metamask extension or Retry")
        }
    }

    isConnected = async () => {
        if (this.provider === null || this.provider === undefined) {
            this.provider = await this.start()
        }

        const accounts = await this.provider.listAccounts();
        dispatch(setEthersConnected(accounts.length > 0))
        dispatch(setEthersAddress(accounts[0]))
        return accounts.length > 0
    }

    connect = async () => {
        // Prompt user for account connections
        if (this.provider === null || this.provider === undefined) {
            this.provider = await this.start()
        }
        await this.provider.send("eth_requestAccounts", []);
    }

    getSigner = async () => {
        if (this.provider === null || this.provider === undefined) {
            this.provider = await this.start()
        }
        return this.provider.getSigner();
    }

    getContract = async (contractName: string) => {
        const address = TokenMetadata[contractName].address;
        const contractABI = TokenMetadata[contractName].abi;
        const signer = await this.getSigner()
        return new ethers.Contract(address, contractABI, signer);
    }
}