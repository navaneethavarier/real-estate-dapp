import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import { useNavigate } from "react-router-dom";

const ethers = require("ethers");
const cname = "flex text-center flex-col mt-11 md:text-2xl text-white";
const cname2 =
  "flex text-center flex-row justify-center mt-10 md:text-2xl text-white";

export default function Account() {
  const navigate = useNavigate();
  const [listingsdata, setListingsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [walletaddress, setWalletAddress] = useState("0x");
  const [balance, setBalance] = useState();
  const [netWorth, setNetWorth] = useState("0");

  useEffect(() => {
    console.log(localStorage.getItem("accountverified"));
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
    setWalletAddress(address1);
    setNetWorth(totalcost.toPrecision(3));
  }

  // const params = useParams();
  // const tokenId = params.tokenId;
  if (!flag) {
    getInvestments();
  }

  return (
    <div
    // className="profileClass" style={{ "min-height": "100vh" }}
    >
      <Navbar></Navbar>
      <div
      // className="profileClass"
      >
        <div className={cname}>
          <div
          // className="mb-5"
          >
            <h2
            // className="font-bold"
            >
              Wallet Address
            </h2>
            {walletaddress}
          </div>
        </div>
        <div className={cname}>
          <div
          // className="mb-5"
          >
            <h2
            // className="font-bold"
            >
              Wallet balance
            </h2>
            {balance} ETH
          </div>
        </div>
        <div className={cname2}>
          <div>
            <h2
            // className="font-bold"
            >
              Number of Investments
            </h2>
            {listingsdata.length}
          </div>
          <div className="ml-20">
            <h2
            // className="font-bold"
            >
              Net Worth
            </h2>
            {netWorth} ETH
          </div>
        </div>
        <div className={`${cname} mt-11`}>
          <h2
          // className="font-bold"
          >
            Your Investments
          </h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {listingsdata &&
              listingsdata !== undefined &&
              listingsdata.map((value, index) => {
                console.log("VALUE", value);
                return (
                  <ListingCard listingsdata={value} key={index}></ListingCard>
                );
              })}
          </div>
          <div
          // className="mt-10 text-xl"
          >
            {listingsdata.length == 0 ? "Sorry, no data available." : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
