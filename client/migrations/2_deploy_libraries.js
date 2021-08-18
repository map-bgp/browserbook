var Exchange = artifacts.require("Exchange");
var DevUtils = artifacts.require("DevUtils");
var LibAssetData = artifacts.require("LibAssetData")
var LibTransactionDecoder = artifacts.require("LibTransactionDecoder")
var LibOrderTransferSimulation = artifacts.require("LibOrderTransferSimulation")


module.exports = async function (deployer) {
    await deployer.deploy(LibAssetData)
    await deployer.deploy(LibTransactionDecoder)
    await deployer.deploy(LibOrderTransferSimulation)
  
    await deployer.link(LibAssetData, DevUtils);
    await deployer.link(LibTransactionDecoder, DevUtils);
    await deployer.link(LibOrderTransferSimulation, DevUtils);
  
    var exchange = await Exchange.deployed();
    await deployer.deploy(DevUtils, exchange.address);
};
