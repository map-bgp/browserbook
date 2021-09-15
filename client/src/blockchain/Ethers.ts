import {ethers} from "ethers";
import { fetchABI } from "./abiFetcher";

declare const window: any;

export class Ethers{
    public provider: ethers.providers.Web3Provider;

    constructor() {
        if(window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        else {
            window.ethereum.enable();
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        }
    }

    getSigner(){
    return this.provider.getSigner();
    }

    getContract(address, contractName:string){
        const contractAbi = fetchABI(contractName);
        return new ethers.Contract(address,contractAbi);
    }

    getProvider(){
        return this.provider;
    }

}