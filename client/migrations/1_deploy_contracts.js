var ERC20Proxy = artifacts.require("ERC20Proxy");
var ERC721Proxy = artifacts.require("ERC721Proxy");
var ERC1155Proxy = artifacts.require("ERC1155Proxy");
var Exchange = artifacts.require("Exchange");
var MaximumGasPrice = artifacts.require("MaximumGasPrice");
var DevUtils = artifacts.require("DevUtils");
var LibAssetData = artifacts.require("LibAssetData")
var LibTransactionDecoder = artifacts.require("LibTransactionDecoder")
var LibOrderTransferSimulation = artifacts.require("LibOrderTransferSimulation")


module.exports = async function (deployer) {
  await deployer.deploy(ERC20Proxy);
  await deployer.deploy(ERC721Proxy);
  await deployer.deploy(ERC1155Proxy);
  await deployer.deploy(Exchange, "80001");
  await deployer.deploy(MaximumGasPrice)
};