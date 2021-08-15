module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const  { deployer } = await getNamedAccounts();

    // We get the contract to deploy

    await deploy("ERC20Proxy", { from: deployer, gasLimit: 4000000, log: true });

    await deploy("ERC721Proxy", { from: deployer, gasLimit: 4000000, log: true });

    await deploy("ERC1155Proxy", { from: deployer, gasLimit: 4000000, log: true });

    await deploy("MaximumGasPrice", { from: deployer, gasLimit: 4000000, log: true });

    const exchange = await deploy("Exchange", { from: deployer, gasLimit: 40000000, args: ["80001"], log: true });

    console.log(exchange.address)

    const LibAssetData = await deploy("LibAssetData", { from: deployer, gasLimit: 40000000, log: true });
    const LibTransactionDecoder = await deploy("LibTransactionDecoder", { from: deployer, gasLimit: 40000000, log: true });
    const LibOrderTransferSimulation = await deploy("LibOrderTransferSimulation", { from: deployer, gasLimit: 40000000, log: true });

    console.table({
        "LibAssetData": LibAssetData.address,
        "LibTransactionDecoder": LibTransactionDecoder.address,
        "LibOrderTransferSimulation": LibOrderTransferSimulation.address
    });


    await deploy("DevUtils", { from: deployer, gasLimit: 40000000, args: [exchange.address] , libraries:{
        "LibAssetData": LibAssetData.address,
        "LibTransactionDecoder": LibTransactionDecoder.address,
        "LibOrderTransferSimulation": LibOrderTransferSimulation.address
    }});

}


module.exports.tags = ['0x'];
