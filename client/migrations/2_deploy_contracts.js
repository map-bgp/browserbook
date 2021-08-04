var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Exchange = artifacts.require("Exchange");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Exchange,"1337");
};
