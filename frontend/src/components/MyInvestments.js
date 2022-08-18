import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import ListingCard from "./ListingCard";
import { css1, css2, cname } from "./exportCSS";
import Navbar from "./Navbar";

const ethers = require("ethers");

const MyInvestments = () => {
  const navigate = useNavigate();

  const [listingsdata, setListingsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [balance, setBalance] = useState();

  useEffect(() => {
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }
  }, []);

  async function getInvestments() {
    let totalcost = 0;
    const ethprovider = new ethers.providers.Web3Provider(window.ethereum);
    const ethsigner = ethprovider.getSigner();
    const address1 = await ethsigner.getAddress();
    const balance1 = await ethsigner.getBalance();
    setBalance(ethers.utils.formatEther(balance1));

    console.log(address1);

    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      ethsigner
    );

    let transaction = await contract.getMyInvestments();

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
        totalcost += Number(price);
        return item;
      })
    );

    setListingsData(items);
    setFlag(true);
  }

  if (!flag) {
    getInvestments();
  }

  return (
    <>
      <Navbar></Navbar>
      <div className={`${cname}  text-white mt-11`}>
        <h2>Your Investments</h2>
        <div className="flex justify-center flex-wrap max-w-screen-xl">
          {listingsdata &&
            listingsdata !== undefined &&
            listingsdata.map((value, index) => {
              return (
                <ListingCard listingsdata={value} key={index}></ListingCard>
              );
            })}
        </div>
        <div>{listingsdata.length == 0 ? "Sorry, no data available." : ""}</div>
      </div>
    </>
  );
};

export default MyInvestments;
