import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import { useNavigate } from "react-router-dom";
import { css1, css2, cname } from "./exportCSS";

const ethers = require("ethers");

export default function Account() {
  const navigate = useNavigate();
  const [listingsdata, setListingsData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [walletaddress, setWalletAddress] = useState("0x");
  const [balance, setBalance] = useState();
  const [netWorth, setNetWorth] = useState("0");

  useEffect(() => {
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }

    console.log("account", walletaddress);
  }, [walletaddress]);

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
    setWalletAddress(address1);
    setNetWorth(totalcost.toPrecision(3));
  }

  if (!flag) {
    getInvestments();
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className={`${css2} mt-10`}>
        <div className={`${cname}  text-white m-4`}>
          <h2>Your Account Details</h2>{" "}
        </div>
        <form className={css1}>
          <div className={`${cname} text-black`}>
            <h2>Wallet Address - {walletaddress}</h2>
          </div>
          <div className={cname}>
            <h2>Wallet balance - {balance} ETH</h2>
          </div>

          <div className={cname}>
            <h2>Number of Investments - {listingsdata.length}</h2>
          </div>

          <div className={cname}>
            <h2>Net Worth - {netWorth} ETH</h2>
          </div>
        </form>
      </div>
      {/* <>
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
          <div>
            {listingsdata.length == 0 ? "Sorry, no data available." : ""}
          </div>
        </div>
      </> */}
    </div>
  );
}
