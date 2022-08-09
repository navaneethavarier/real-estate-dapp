import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = (data) => {
  const navigate = useNavigate();
  console.log("Value from ListingsCard", data);

  useEffect(() => {
    console.log(localStorage.getItem("accountverified"));
    if (localStorage.getItem("accountverified") === null) {
      alert("Please login to access the platform");
      navigate("/login");
    }
  }, []);
  const newTo = {
    pathname: "/listingdetails/" + data.listingsdata.tokenId,
  };
  return (
    <Link to={newTo}>
      <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
        <img
          src={data.listingsdata.image}
          alt=""
          className="w-72 h-80 rounded-lg object-cover"
        />
        <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
          <strong className="text-xl">{data.listingsdata.name}</strong>
          <p className="display-inline">{data.listingsdata.price} ETH</p>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
