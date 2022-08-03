import React, { useState } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import web3 from "web3";
import { useNavigate } from "react-router-dom";
const ethereum = window.ethereum;
const weeb3 = new web3(window.ethereum);

const Login1 = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    let message =
      "Hello! Please sign this message to confirm that you have access to this Ethereum wallet - it's free and will increase your account's safety.";
    // let nonce = "In order to increase your security, this is your unique nonce for this login session - da-123-hgsdjjhfhbs";
    // message = message + nonce;
    // console.log(message);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, account],
    });

    //verification
    const verify = await weeb3.eth.accounts.recover(
      "Hello! Please sign this message to confirm that you have access to this Ethereum wallet - it's free and will increase your account's safety.",
      signature
    );

    if (verify.toUpperCase() == account.toUpperCase()) {
      //redirect to listings page
      navigate("/");
      localStorage.setItem("accountverified", true);
    } else {
      //Request user to login again
      alert("Please login again");
      localStorage.setItem("accountverified", false);
    }
  };
  return (
    <div
      style={{ fontColour: "white" }}
      className="flex flex-col place-items-center mt-20 pb-10"
    >
      <div className="md:text-xl font-bold text-white ">Login Options</div>
      <button className="Login-button Login-mm" onClick={handleClick}>
        Login with MetaMask
      </button>
      <button className="Login-button Login-mm" onClick={handleClick}>
        Option 2
      </button>
      <button className="Login-button Login-mm" onClick={handleClick}>
        Option 3
      </button>
    </div>
  );
};

export default Login1;
