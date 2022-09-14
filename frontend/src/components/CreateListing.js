import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { uploadImage, uploadJson } from "../pinata";
import ListingsJson from "../Listings.json";
import { useNavigate } from "react-router-dom";
import { buttonstyle, css1, css2, fontstyle, labelstyle } from "./exportCSS";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ethers = require("ethers");

export default function CreateListing() {
  const navigate = useNavigate();
  const [newListing, setNewListing] = useState({
    name: "",
    desc: "",
    cost: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }
  }, []);

  async function onFileChange(e) {
    var file = e.target.files[0];
    try {
      const res = await uploadImage(file);
      if (res.success === true) {
        setImageFile(res.pinataURL);
      }
    } catch (e) {
      console.log("Error during image upload to Pinata", e);
    }
  }

  async function uploadData() {
    const { name, desc, cost } = newListing;

    if (!name || !desc || !cost || !imageFile) {
      return;
    }

    const json = {
      name,
      desc,
      cost,
      image: imageFile,
    };

    try {
      const res = await uploadJson(json);
      if (res.success === true) {
        return res.pinataURL;
      }
    } catch (e) {
      console.log("Error", e);
    }
  }

  async function createListing(e) {
    e.preventDefault();

    try {
      const metadataURL = await uploadData();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setStatus(
        "Data upload in progress. Please wait, this may take a few minutes"
      );

      let contract = new ethers.Contract(
        ListingsJson.address,
        ListingsJson.abi,
        signer
      );

      const cost = ethers.utils.parseUnits(newListing.cost, "ether");
      let listingPrice = await contract.getPrice();
      listingPrice = listingPrice.toString();

      let transaction = await contract.createPropListing(metadataURL, cost, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully created your listing!");
      setStatus(" ");
      setNewListing({ name: "", desc: "", cost: "" });
      window.location.replace("/");
    } catch (e) {
      console.log("Upload error", e);
      alert("Upload error");
    }
  }

  return (
    <>
      <Navbar></Navbar>

      <div className={css2}>
        <form className={css1}>
          <h3 className="text-center font-bold text-grey-500 mb-5">
            Please enter the details
          </h3>
          <div className="mb-4">
            <label className={`${fontstyle}`} htmlFor="name">
              Listing Title
            </label>
            <input
              className={`${labelstyle}`}
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
            <label className={`${fontstyle}`} htmlFor="description">
              Description
            </label>
            <input
              className={`${labelstyle}`}
              id="name"
              type="text"
              placeholder="Enter Description"
              onChange={(e) =>
                setNewListing({ ...newListing, desc: e.target.value })
              }
              value={newListing.desc}
            ></input>
            {/* <textarea
              className={`${labelstyle}`}
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Enter listing details"
              value={newListing.description}
              onChange={(e) =>
                setNewListing({ ...newListing, desc: e.target.value })
              }
            ></textarea> */}
          </div>
          <div className="mb-6">
            <label className={`${fontstyle}`} htmlFor="price">
              Price (in ETH)
            </label>
            <input
              className={`${labelstyle}`}
              type="number"
              placeholder="Enter the asking price of the property"
              step="0.01"
              value={newListing.cost}
              onChange={(e) =>
                setNewListing({ ...newListing, cost: e.target.value })
              }
            ></input>
          </div>
          <div>
            <label className={`${fontstyle}`} htmlFor="image">
              Upload Image
            </label>
            <input type={"file"} onChange={onFileChange}></input>
          </div>
          <br></br>
          <div className="text-green text-center">{status}</div>
          <button
            onClick={createListing}
            className={`${buttonstyle}  w-full bg-pink-500`}
          >
            Create Property Listing
          </button>
        </form>
      </div>
    </>
  );
}
