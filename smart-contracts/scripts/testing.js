const Listings = require("../src/Listings.json");

async function getListings() {
  const MyContract = await ethers.getContractFactory("RealEstateDapp");
  const contract = await MyContract.attach(Listings.address);
  var vals = await contract.getListPrice();
  console.log(vals);
}
