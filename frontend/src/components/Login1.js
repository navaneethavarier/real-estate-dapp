import React from "react";
import PropTypes from "prop-types";
import web3 from "web3";
const ethereum = window.ethereum;

function Login1() {
  const handleClick = async () => {
    const message =
      "Hello! Please sign this message to confirm that you have access to this Ethereum wallet - it's free and will increase your account's safety.";
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, account],
    });
    console.log(signature);

    //verification
    const verify = await web3.eth.accounts.recover(
      "Hello! Please sign this message to confirm that you have access to this Ethereum wallet - it's free and will increase your account's safety.",
      signature
    );
    console.log(verify);
  };
  return (
    <div style={{ fontColour: "red" }}>
      <p>Login</p>
      <button className="Login-button Login-mm" onClick={handleClick}>
        Login with MetaMask
      </button>
    </div>
  );
}

export default Login1;
