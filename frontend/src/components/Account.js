import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState } from "react";
import ListingCard from "./ListingCard";

export default function Account() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [balance, setBalance] = useState();

  const [totalPrice, updateTotalPrice] = useState("0");

  async function getInvestments(tokenId) {
    const ethers = require("ethers");
    let sumPrice = 0;
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("Signer = ", signer);
    const addr = await signer.getAddress();
    const bal = await signer.getBalance();
    setBalance(ethers.utils.formatEther(bal));

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      signer
    );

    //create an NFT Token
    let transaction = await contract.getMyInvestments();

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

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
        sumPrice += Number(price);
        return item;
      })
    );

    updateData(items);
    updateFetched(true);
    updateAddress(addr);
    updateTotalPrice(sumPrice.toPrecision(3));
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) {
    getInvestments(tokenId);
  }

  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet balance</h2>
            {balance} ETH
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">Number of Investments</h2>
            {data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {totalPrice} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your Investments</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <ListingCard data={value} key={index}></ListingCard>;
            })}
          </div>
          <div className="mt-10 text-xl">
            {data.length == 0 ? "Sorry, no data available." : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
