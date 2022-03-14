# Browserbook

Browserbook is a prototypical implementation of a peer-to-peer decentralised token exchange. (DEX) Browserbook was developed by Corey Bothwell, Ankan Gosh, and Saiteja Pottanigari at the University of Zurich in 2022. 

## Using the Application

Our application is deployed to IPFS. To use the application, simply navigate to the following url: PLACE_URL_HERE
Alternatively, you can navigate to the application by requesting the following content hash from IPFS: 
Once at the application, navigate to the "How it Works" page for an overview on how to use the system.

**Note**: You will need to have metamask installed in order to access the application.

Alternatively, you can build the application locally.

## Building and running a local copy of the Application

In order to build the system locally, the following requirements must be met:

- Node.js 16.3.2 or equivalent version
- Node Package Manager (NPM) 8.1.2 or Yarn 1.22.17 (or equivalent versions)
- Any browser supporting MetaMask Eg: Firefox, Brave, Chrome, etc.
- Install the Metamask browser extensions in the browser of choice

After cloning the repository, please follow the steps below

### Compiling and Deploying the Smart Contracts

The first thing to do is to navigate to the chain directory and install all dependencies:

```
cd chain && yarn
```

#### Building for Hardhat (locally)

We use Hardhat as a development environment for compiling, building, testing, and deploying the Smart Contracts. Using Hardhat simplifies the deployment of the contracts to a local Ethereum node or any EVM-based Network. For local deployments, Hardhat mimics a public blockchain on your private machine for development. In the `./chain` directory, run the following command: 

```
yarn hardhat node 
```

to start a local node. You are now running a local blockchain and can deploy Browserbook against it for testing purposes. To continue, open another terminal and  navigate again to `./chain` and run 

```
yarn hardhat run ./scripts/deploy.ts --network localhost
```

Hardhat will compile the contracts and deploy them to your local node. Be sure to note the console output which should deploy something like the following:

```
TokenFactory deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Exchange deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✨  Done in 4.00s.
```

Note that in your output the provided addresses may differ.

#### Building for Mumbai (Testnet)

Before deploying to Mumbai, a few environment variables must be set. Copy the `env.example` file to `.env` via 

```
cp env.example .env
```

You should see the following variables. 

- `ETHERSCAN_API_KEY=`
- `PRIVATE_KEY=`

The Etherscan API Key is optional; the private key variable must be set and is the private key of the account with which you would like to deploy the contracts to the Mumbai testnet. Note that this account must have a sufficient balance of MATIC to cover the deployment gas fees. 

We need to make one manual adjustment to our contract in order to ensure it is compatible with the Mumbai testnet. Navigate to `./chain/contracts/Exchange.sol` and change the `chainId` on line 48 from `31337` to `80001`. (We optimised for users deploying to Hardhat. 31337 is the chainId for the local Hardhat node, while 80001 is the chainId for Mumbai) Be sure to save the file.

Once the above is complete, run the following command from `./chain`:

```
yarn hardhat run ./scripts/deploy.ts --network mumbai
```

You should see something like the following:

```
TokenFactory deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Exchange deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✨  Done in 4.00s.
```

Be sure to note the deployment addresses as they are used to successfully build the client.

### Building and Running the Client Application

In order to interact with smart contracts, we need to build and run the client application. Once again the first thing to do is install required dependencies by navigating to `./client` and running yarn.

```
cd client && yarn
```

Before we can build the application, we need to set some important environment variables. Copy the example environment file from `env.example` via:

```
cp env.example .env
```

You will need to set the following environment variables in order to sucessfully build the application:

- `TOKEN_FACTORY_ADDRESS=` Use the deployment address output from the console above
- `EXCHANGE_ADDRESS=` Use the deployment address output from the console above
- `SIGNER_RPC_URL='http://34.134.45.184:8545'` Use the url provided here, this is our private RPC node available for users of this project during its release
- `PERF_TEST_KEY_BUY='0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'`
- `PERF_TEST_KEY_SELL='0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'`

We use the above private keys to perform dummy transactions in the performance test. The private keys above are known private keys provided by the local Hardhat node, so they are safe to distribute here. When running the Hardhat node, they have an initial balance of 10000 Ether on the local network, so they are well suited for running the performance test. (Never send live Ether to the addresses associated with these private keys) If you want to use different private keys for a performance test (say you are running on a different network), you can change them here. There are some additional steps to get up in running with performance testing detailed on the applications's "How it Works" page.

**Note**: If you are running the application to talk to the Mumbai testnet, we need to similarly make one manual change to the codebase. Navigate to `./client/src/app/oms/OrderService.ts` and change the `chainId` on line 22 from `31337` to `80001`. 

After optionally performing the above and setting the appropriate environment variables, we are ready to run the application. 

To run the application locally simply run:

```
yarn dev
```

Please be sure that port 3000 is not occupied. To visit the application, navigate to `localhost:3000` in your browser. Please ensure that Metamask is installed. Also note that you will need to ensure Metamask is configured to either talk to your local Hardhat node or an appropriate Mumbai RPC. For Hardhat, the appropriate RPC url is `http://localhost:8545`, while an example Mumbai RPC is `https://rpc-mumbai.matic.today`. The chainId's are `31337` and `80001` respectively.

If you would like to create a production build, run the following:

```
yarn build
```

This will create a `./dist` directory with a production build which is deployable to any sort of static file hosting, including IPFS. **Note:** Because of a particularity in the way that static file servers (including IPFS) handle our build tools output, it is necessary to make a small change to the `./dist/index.html` file before hosting in order to ensure that nested routes/content are properly referenced. Navigate to the `./dist/index.html` file and replace all root paths such as `<script src="/index.96e2502d.js" defer=""></script>` to be *relative* paths i.e. `<script src="./index.96e2502d.js" defer=""></script>` We recommend performing this manually as there should only be three such instances to change in your output. Once complete the files are ready for upload to a hosting provider. 
