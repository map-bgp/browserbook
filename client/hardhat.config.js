require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address, account.privateKey);
    }
});

module.exports = {
    networks: {
        hardhat: {
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            allowUnlimitedContractSize: true,
            blockGasLimit: 0x1fffffffffff
        },
        development: {
            url: "http://localhost:9545",
            accounts: { mnemonic: "muffin area swamp arm hundred photo upon chalk acoustic dawn home dragon" }
        },
        goerli:{
            url: process.env.GOERLI_RPC_URL,
            accounts: { mnemonic: process.env.GOERLI_MNEMONIC },
            gasPrice: 10000000000,
            network_id: 5,
        },
        mumbai: {
            url: process.env.MUMBAI_RPC_URL,
            accounts: { mnemonic: process.env.MUMBAI_MNEMONIC },
            gasPrice: 10000000000,
            network_id: 80001,
        }
    },
    namedAccounts: {
        deployer: 0
    },
    etherscan:{
        apiKey: "N2X6D6SRJQA8HTD12G798IDTIT4DBR61QG"
    },
    solidity: {
        version: "0.8.0",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};