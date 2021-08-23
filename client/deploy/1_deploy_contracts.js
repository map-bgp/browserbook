module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const  { deployer } = await getNamedAccounts();

    // We get the contract to deploy

    const ERC20Proxy = await deploy("ERC20Proxy", { from: deployer, gasLimit: 4000000, log: true });
    const ERC721Proxy = await deploy("ERC721Proxy", { from: deployer, gasLimit: 4000000, log: true });
    const ERC1155Proxy = await deploy("ERC1155Proxy", { from: deployer, gasLimit: 4000000, log: true });
    const MaximumGasPrice = await deploy("MaximumGasPrice", { from: deployer, gasLimit: 4000000, log: true });
    const Exchange = await deploy("Exchange", { from: deployer, gasLimit: 6721975, args: ["80001"], log: true });
    const LibAssetData = await deploy("LibAssetData", { from: deployer, gasLimit: 6721975, log: true });
    const LibTransactionDecoder = await deploy("LibTransactionDecoder", { from: deployer, gasLimit: 6721975, log: true });
    const LibOrderTransferSimulation = await deploy("LibOrderTransferSimulation", { from: deployer, gasLimit: 6721975, log: true });
    const DevUtils = await deploy("DevUtils", { from: deployer, gasLimit: 6721975, args: [Exchange.address] , libraries:{
        "LibAssetData": LibAssetData.address,
        "LibTransactionDecoder": LibTransactionDecoder.address,
        "LibOrderTransferSimulation": LibOrderTransferSimulation.address
    }});

    console.table({
        "ERC20Proxy": ERC20Proxy.address,
        "ERC721Proxy": ERC721Proxy.address,
        "ERC1155Proxy": ERC1155Proxy.address,
        "MaximumGasPrice": MaximumGasPrice.address,    
        "Exchange": Exchange.address,
        "LibAssetData": LibAssetData.address,
        "LibTransactionDecoder": LibTransactionDecoder.address,
        "LibOrderTransferSimulation": LibOrderTransferSimulation.address,
        "DevUtils": DevUtils.address
    });
}


module.exports.tags = ['0x'];
