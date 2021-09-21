import {ethers} from "ethers";
import { fetchABI } from "./abiFetcher";

declare const window: any;

export class EtherStore{
    provider: ethers.providers.Web3Provider;

    async Start(){
        if(typeof window.ethereum !== 'undefined') {
            await window.ethereum.enable()
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        else {
            console.log("Install MetaMask")
            throw new Error("Please install the Metamask extension or Retry")
        }
    }

    async isConnected() {
        const accounts = await this.provider.listAccounts();
        return accounts.length > 0;
    }

    getSigner(){
        return this.provider.getSigner();
    }

    getContract(address:string, contractName:string){
        const contractAbi = fetchABI(contractName);
        return new ethers.Contract(address,contractAbi);
    }

    getProvider(){
        return this.provider;
    }

}