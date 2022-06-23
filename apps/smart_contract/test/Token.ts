import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();
    await hardhatToken.deployed();

    const ownerBalance = await hardhatToken.balanceOf(owner.getAddress());
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
