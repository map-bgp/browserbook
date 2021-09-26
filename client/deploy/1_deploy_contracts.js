const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const  { deployer } = await getNamedAccounts();

    console.log(`Deployer :${deployer}`);
    // We get the contract to deploy
    const tx = await deploy("BBookToken", { from: deployer, gasLimit: 12000000, log: true });

    console.log(tx.transactionHash);

    await ethers.provider.waitForTransaction(tx.transactionHash,2)

    const tx2 = await deploy("BBookToken2", {from: deployer, gasLimit: 12000000, log: true });

    console.log(tx2.transactionHash);
    
    await ethers.provider.waitForTransaction(tx2.transactionHash,2)

    const tx3 = await deploy("Exchange", {from: deployer, gasLimit: 12000000, log: true});

    console.log(tx3.transactionHash);
    
    await ethers.provider.waitForTransaction(tx3.transactionHash,2)
}

module.exports.tags = ['All'];
