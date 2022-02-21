/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers } from "hardhat";
import { ethers as ethersLib } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export type ChainOrder = {
  id: string;
  from: string;
  tokenAddress: string;
  tokenId: ethersLib.BigNumber;
  orderType: number;
  price: ethersLib.BigNumber;
  limitPrice: ethersLib.BigNumber;
  quantity: ethersLib.BigNumber;
  expiry: ethersLib.BigNumber;
};

let Sign;
let sign;

let owner: SignerWithAddress;
let addr1;
let addr2;
let addrs;

beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  Sign = await ethers.getContractFactory("Sign");
  sign = await Sign.deploy();
  await sign.deployed();

  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
});

describe("Signature Recovery", function () {
  it("Return true", async function () {
    const Sign = await ethers.getContractFactory("Sign");
    const sign = await Sign.deploy();
    await sign.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");
    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    // expect(await greeter.greet()).to.equal("Hola, mundo!");

    const OrderDomain = {
      name: "BrowserBook",
      version: "1",
      chainId: 31337,
      verifyingContract: sign.address, // Assume set correctly
    };

    const OrderTypes = {
      Order: [
        { name: "id", type: "string" },
        { name: "from", type: "address" },
        { name: "tokenAddress", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "orderType", type: "uint" },
        { name: "price", type: "uint256" },
        { name: "limitPrice", type: "uint256" },
        { name: "quantity", type: "uint256" },
        { name: "expiry", type: "uint256" },
      ],
    };

    const unsignedOrder: ChainOrder = {
      id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
      from: owner.address,
      tokenAddress: "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
      tokenId: ethersLib.BigNumber.from(1),
      orderType: 0,
      price: ethersLib.utils.parseEther("1.00"),
      limitPrice: ethersLib.utils.parseEther("1.00"),
      quantity: ethersLib.utils.parseEther("1.00"),
      expiry: ethersLib.BigNumber.from("1645643644882"),
    };

    // ethers.js
    const signature = await owner?._signTypedData(
      OrderDomain,
      OrderTypes,
      unsignedOrder
    );

    const signedOrder = { ...unsignedOrder, signature };

    expect(await sign.verifySignature(signedOrder)).to.equal(true);
    console.log(
      "Signature Verification",
      await sign.verifySignature(signedOrder)
    );
  });
});
