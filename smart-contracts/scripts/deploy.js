const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const RealEstateDapp = await hre.ethers.getContractFactory("RealEstateDapp");
  const realEstateDapp = await RealEstateDapp.deploy();

  await realEstateDapp.deployed();

  const data = {
    address: realEstateDapp.address,
    abi: JSON.parse(realEstateDapp.interface.format("json")),
  };

  fs.writeFileSync("./src/Listings.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
