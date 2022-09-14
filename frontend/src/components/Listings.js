import Navbar from "./Navbar";
import ListingCard from "./ListingCard";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { css1, css2, cname } from "./exportCSS";

export default function Listings() {
  const navigate = useNavigate();
  const [data, updateData] = useState();
  const [dataFetched, updateFetched] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }
  }, []);

  async function getAllListings() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      signer
    );
    console.log(signer);
    let transaction = await contract.getAllListings();

    const items = await Promise.all(
      transaction.map(async (i) => {
        if (i.currentlyListed === true) {
          const tokenURI = await contract.tokenURI(i.tokenId);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            currentlyListed: i.currentlyListed,
            image: meta.image,
            name: meta.name,
            desc: meta.desc,
          };
          return item;
        }
      })
    );
    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllListings();

  return (
    <div>
      <Navbar></Navbar>
      <div className={`${css2} mt-20`}>
        <div className={`${cname}  text-white m-4`}>
          <h2>Property Listings</h2>{" "}
        </div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data && data !== undefined && data !== null ? (
            data.map((value, index) => {
              console.log("here111111", value);
              if (value !== undefined) {
                return (
                  <ListingCard listingsdata={value} key={index}></ListingCard>
                );
              }
            })
          ) : (
            <h1 style={{ color: "white" }}>No data available</h1>
          )}
        </div>
      </div>
    </div>
  );
}
