import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import ListingsJson from "../Listings.json";
import axios from "axios";
import { useState } from "react";

const ListingDetails = (props) => {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  const [newSP, setNewSP] = useState();

  async function getListingDetails(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      ListingsJson.address,
      ListingsJson.abi,
      signer
    );
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
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
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the property!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const changePrice = async (e) => {
    e.preventDefault();

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

      // const price = ethers.utils.parseUnits(newListing.price, "ether");

      // let transaction = await contract.createToken(metadataURL, price, {
      //   value: listingPrice,
      // });
      // await transaction.wait();

      // contract.updateListPrice(sp);

      alert("Successfully created your listing!");
      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
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
              <span className="">{data.price + " ETH"}</span>
            )}{" "}
            ETH
          </div>
          {currAddress == data.owner ||
            (currAddress == data.seller && (
              <button onClick={changePrice}>Change Price</button>
            ))}

          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress == data.owner || currAddress == data.seller ? (
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
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
