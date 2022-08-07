import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import ListingsJson from "../Listings.json";
// import { useLocation } from "react-router";

const ethers = require("ethers");

export default function CreateListing() {
  const [newListing, setNewListing] = useState({
    name: "",
    desc: "",
    cost: "",
  });
  const [fileURL, setFileURL] = useState(null);
  const [status, setStatus] = useState("");
  // const location = useLocation();

  async function OnChangeFile(e) {
    var file = e.target.files[0];
    try {
      const res = await uploadFileToIPFS(file);
      if (res.success === true) {
        console.log("Uploaded image to Pinata: ", res.pinataURL);
        setFileURL(res.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, desc, cost } = newListing;

    if (!name || !desc || !cost || !fileURL) return;

    const nftJSON = {
      name,
      desc,
      cost,
      image: fileURL,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function createListing(e) {
    e.preventDefault();

    try {
      const metadataURL = await uploadMetadataToIPFS();
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setStatus(
        "Data upload in progress. Please wait, this may take a few minutes"
      );

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        ListingsJson.address,
        ListingsJson.abi,
        signer
      );

      const price = ethers.utils.parseUnits(newListing.cost, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully created your listing!");
      setStatus(" ");
      setNewListing({ name: "", description: "", price: "" });
      window.location.replace("/");
    } catch (e) {
      console.log("Upload error", e);

      // alert("Upload error" + e);
    }
  }

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Create new listing
          </h3>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Listing Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter listing title"
              onChange={(e) =>
                setNewListing({ ...newListing, name: e.target.value })
              }
              value={newListing.name}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Enter listing details"
              value={newListing.description}
              onChange={(e) =>
                setNewListing({ ...newListing, desc: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (in ETH)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Enter the asking price of the property"
              step="0.01"
              value={newListing.price}
              onChange={(e) =>
                setNewListing({ ...newListing, cost: e.target.value })
              }
            ></input>
          </div>
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input type={"file"} onChange={OnChangeFile}></input>
          </div>
          <br></br>
          <div className="text-green text-center">{status}</div>
          <button
            onClick={createListing}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
          >
            Create Property Listing
          </button>
        </form>
      </div>
    </div>
  );
}
