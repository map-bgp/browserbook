var ERC721Proxy = artifacts.require("BBookToken");
var ERC1155Proxy = artifacts.require("BBookToken2");
var Exchange = artifacts.require("Exchange");

module.exports = async function (deployer) {
  await deployer.deploy(ERC20Proxy);
  await deployer.deploy(ERC721Proxy);
  await deployer.deploy(ERC1155Proxy);
};