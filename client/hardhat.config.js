require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
    networks: {
        hardhat: {
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            allowUnlimitedContractSize: true,
            blockGasLimit: 0x1fffffffffff
        },
        development: {
            url: "http://192.41.136.236:9545",
            accounts:{mnemonic:"hawk myth suggest very kitten fine ketchup message pulse fuel field muscle"}
        },
        mumbai: {
            url: process.env.MUMBAI_RPC_URL,
            accounts: { mnemonic: process.env.MUMBAI_MNEMONIC }
        }
    },

    namedAccounts: {
        deployer: 0
    },



    solidity: {
        version: "0.5.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
};