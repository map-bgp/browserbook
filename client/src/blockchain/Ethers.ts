import {ethers} from "ethers";
import {setEthersAddress, setEthersConnected} from "../store/slices/EthersSlice";
import {store} from "../store/Store";
import {TokenMetadata} from "./browser_abi/abi";

const ethUtil = require('ethereumjs-util');
const sigUtil = require("eth-sig-util");

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

    getProvider = async () => {
        return this.provider
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

    requestEncryptionKey = async (address: string) => {
        return await ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [address],
        })
    }

    // signAndRecoverPublicKey = async () => {
    //     const signer = await this.getSigner();
    //     const signerAddress = await signer.getAddress()
    //
    //     console.log("Signer Address: ", signerAddress);
    //
    //     const hashBytes = ethers.utils.arrayify(ethers.utils.keccak256(signerAddress))
    //     const signature = await signer.signMessage(hashBytes)
    //
    //     // For recovery
    //     let messageHashBytes = ethers.utils.arrayify(ethers.utils.hashMessage(hashBytes));
    //
    //     const payload = {
    //         message: hashBytes,
    //         signature
    //     };
    //
    //     const publicKey = ethers.utils.recoverPublicKey(messageHashBytes, signature)
    //     console.log("Computed Public Key: ", publicKey)
    //
    //     const publicKeyAddress = ethers.utils.computeAddress(publicKey)
    //     console.log("Computed Address: ", publicKeyAddress)
    //
    //     const recoverAddress = ethers.utils.recoverAddress(messageHashBytes, signature)
    //     console.log("Recovered Address: ", recoverAddress)
    //
    //     return publicKey
    // }

    encryptMessage = async (address: string) => {
        const encryptionPublicKey =  await this.requestEncryptionKey(address)
        const signerKey = ethers.Wallet.createRandom().privateKey

        console.log("Signer Key before Encryption", signerKey);

        const cipherText = ethUtil.bufferToHex(
          Buffer.from(
            JSON.stringify(
              sigUtil.encrypt(
                encryptionPublicKey,
                { data: signerKey },
                'x25519-xsalsa20-poly1305'
              )
            ),
            'utf8'
          )
        );

        return [cipherText, address]
    }

    decryptMessage = async (cipherText: string, address: string) => {
        return await ethereum.request({
            method: 'eth_decrypt',
            params: [cipherText, address],
        })
    }
}