import Navbar from "./Navbar";
import ListingCard from "./ListingCard";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState } from "react";

export default function Listings() {
  const [data, updateData] = useState();
  const [dataFetched, updateFetched] = useState(false);

  async function getAllListings() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      signer
    );

    let transaction = await contract.getAllListings();

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllListings();

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">
          Recommended Listings
        </div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data &&
            data !== undefined &&
            data !== null &&
            data.map((value, index) => {
              console.log("here111111", value);
              return (
                <ListingCard listingsdata={value} key={index}></ListingCard>
              );
            })}
        </div>
      </div>
    </div>
  );
}
