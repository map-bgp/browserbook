const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Deployer :${deployer}`);

  // We get the contract to deploy
  const tx1 = await deploy("TokenFactory", {
    from: deployer,
    gasPrice: 200000000000,
    log: true,
  });
  console.log(tx1.transactionHash);

  const tx2 = await deploy("Exchange", {
    from: deployer,
    gasPrice: 200000000000,
    log: true,
  });
  console.log(tx2.transactionHash);

  const tx3 = await deploy("Encrypt", {
    from: deployer,
    gasPrice: 200000000000,
    log: true,
  });
  console.log(tx3.transactionHash);

  await ethers.provider.waitForTransaction(tx3.transactionHash, 1);
};

module.exports.tags = ["All"];
