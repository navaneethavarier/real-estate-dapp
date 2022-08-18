const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateDapp Contract", function () {
  let RealEstateDapp;
  let realestatedapp;
  let owner;

  beforeEach(async function () {
    RealEstateDapp = await ethers.getContractFactory("RealEstateDapp");
    [owner] = await ethers.getSigners();
    realestateContract = await RealEstateDapp.deploy();
  });

  describe("Get owner", function () {
    it("should return the correct owner", async function () {
      const tasksFromChain = await realestatedapp.getOwner();
      expect(tasksFromChain).to.equal(owner);
    });
  });
});
