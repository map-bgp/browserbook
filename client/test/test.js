const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("BBookToken", () => {
  beforeEach("Initializations", async () => {
    this.BBookToken = await ethers.getContractFactory("BBookToken");
    this.BBookToken2 = await ethers.getContractFactory("BBookToken2");
    this.signers = await ethers.getSigners();
    this.BBookTokenInstance = await this.BBookToken.deploy();
    this.BBookToken2Instance = await this.BBookToken2.deploy();
    this.buyer = await this.signers[1].getAddress();
    this.seller = await this.signers[2].getAddress();
    this.exchange = await ethers.getContractFactory("Exchange");
    this.exchangeInstance = await this.exchange.deploy();
    this.shitData = "0x4300000000000000000000000000000000000000000000000000000000000000"

  });

  it("BBtoken should be able to mint and show balance", async () => {
    console.log(`minting tokens to ${this.buyer} address`);

    const tx = await this.BBookTokenInstance.mint(
      this.buyer,
      1,
      100,
      this.shitData
    );

    await tx.wait();

    const balance = await this.BBookTokenInstance.balanceOf(this.buyer, 1);

    assert.equal(balance.toString(),"100")
  });

  it("BBtoken2 should be able to mint and show balance", async () => {
    console.log(`minting tokens to ${this.seller} address`);

    const tx = await this.BBookToken2Instance.mint(
      this.seller,
      1,
      200,
      this.shitData
    );

    await tx.wait();

    const balance = await this.BBookToken2Instance.balanceOf(this.seller, 1);

    assert.equal(balance.toString(),"200")
  });



  it("Buyer should be able approve the exchange" , async () => {

    const tx = await this.BBookTokenInstance.setApprovalForAll(this.exchangeInstance.address,true,{from: this.buyer});

    await tx.wait();

    const approval = await this.BBookTokenInstance.isApprovedForAll(this.buyer, this.exchangeInstance.address);

    assert.equal(approval.toString(),"true")
  });


});
