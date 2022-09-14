import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateJSON } from "../pinata";
import { buttonstyle } from "./exportCSS";

const ListingDetails = (props) => {
  const navigate = useNavigate();
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const [newSP, setNewSP] = useState();

  useEffect(() => {
    console.log(data);
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }
  }, [data]);

  const uploadMetadataToIPFS = async () => {
    const json = {
      name: data.name,
      desc: data.description,
      cost: data.price,
      image: data.image,
    };

    try {
      const response = await updateJSON(json);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  };

  async function getListingDetails(tokenId) {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const addr = await signer.getAddress();

    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      signer
    );

    //========================
    let transaction = await contract.getAllListings();

    console.log(transaction[0].currentlyListed);

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          currentlyListed: i.currentlyListed,
          image: meta.image,
          name: meta.name,
          description: meta.desc,
        };
        return item;
      })
    );

    console.log("ITEMS FROM LISTING DETAILS PAGE", items);
    let i;
    for (i = 0; i < items.length; i++) {
      if (items[i].tokenId == tokenId) {
        updateData(items[i]);
        updateDataFetched(true);
        updateCurrAddress(addr);
        break;
      }
    }

    //===========================

    // const tokenURI = await contract.tokenURI(tokenId);

    // const listedToken = await contract.getListedTokenForId(tokenId);
    // let meta = await axios.get(tokenURI);
    // meta = meta.data;

    // let item = {
    //   price: meta.cost || meta.price,
    //   tokenId: tokenId,
    //   seller: listedToken.seller,
    //   owner: listedToken.owner,
    //   image: meta.image,
    //   name: meta.name,
    //   description: meta.description || meta.desc,
    // };

    // updateData(item);
    // updateDataFetched(true);
    // updateCurrAddress(addr);
  }

  async function buyProperty(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        ListingsJson.address,
        ListingsJson.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Property purchase in progress. Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.propertySale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the property!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const changePrice = async () => {
    const metadataURL = await uploadMetadataToIPFS();

    console.log("Update metadata", metadataURL);

    try {
      const ethers = require("ethers");
      // const metadataURL = await uploadMetadataToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        ListingsJson.address,
        ListingsJson.abi,
        signer
      );

      const price = ethers.utils.parseUnits(newSP, "ether");

      let transaction = await contract.updateCost(data.tokenId, price);
      await transaction.wait();

      alert("Successfully updated the price of your listing!");
    } catch (e) {
      console.log(e);
      // alert("Upload error" + e);
    }
  };

  const changeStatus = async (e, status) => {
    const metadataURL = await uploadMetadataToIPFS();

    try {
      const ethers = require("ethers");
      // const metadataURL = await uploadMetadataToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        ListingsJson.address,
        ListingsJson.abi,
        signer
      );

      let transaction = await contract.updateCurrentlyListed(
        data.tokenId,
        status
      );
      await transaction.wait();

      alert("Successfully removed property isting from market!");
    } catch (e) {
      console.log(e);
      alert("Upload error");
    }
  };

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getListingDetails(tokenId);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20">
        <img src={data.image} alt="" className="w-2/5" />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price :
            {currAddress == data.owner || currAddress == data.seller ? (
              <input
                style={{
                  backgroundColor: "black",
                  width: "5em",
                  marginLeft: "1em",
                }}
                defaultValue={data.price}
                onChange={(e) => {
                  setNewSP(e.target.value);
                }}
              />
            ) : (
              <span className="">{data.price}</span>
            )}
            ETH
            {currAddress == data.seller && (
              <button
                className={`${buttonstyle}  w-auto bg-yellow-500 ml-4`}
                onClick={changePrice}
              >
                Change Price
              </button>
            )}
          </div>

          <div>
            Owner : <span className="text-sm">{data.seller}</span>
          </div>

          <div>
            Currently Listed : {data.currentlyListed === true ? "Yes" : "No"}{" "}
            {currAddress == data.owner ||
              (currAddress == data.seller && (
                <button
                  className={`${buttonstyle}  w-auto bg-yellow-500 ml-4`}
                  onClick={(e) => changeStatus(e, !data.currentlyListed)}
                >
                  {data.currentlyListed === false ? (
                    <span>Add to market</span>
                  ) : (
                    <span>Remove from market</span>
                  )}
                </button>
              ))}
          </div>
          <div>
            {currAddress !== data.seller ? (
              <button
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => buyProperty(tokenId)}
              >
                Buy this property
              </button>
            ) : (
              <div className="text-emerald-700">
                You are the owner of this property
              </div>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
