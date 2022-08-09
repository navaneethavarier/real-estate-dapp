import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  const logout = (async) => {
    localStorage.removeItem("accountverified");
    alert("Please login to access the platform");
    navigate("/login");
  };

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (chainId !== "0x5") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();

        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();

    if (val) {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <div>
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-end ml-5 pb-2">
            <Link to="/">
              <div className="inline-block font-bold text-xl ml-2">
                Real-Estate Investments
              </div>
            </Link>
          </li>
          <li className="w-3/6">
            <ul className="lg:flex justify-between font-bold mr-10 text-lg">
              <li className=" hover:pb-0 p-2">
                <Link to="/">Listings</Link>
              </li>

              <li className=" hover:pb-0 p-2">
                <Link to="/createListing">Create Listing</Link>
              </li>

              <li className="hover:pb-0 p-2">
                <Link to="/account">Account</Link>
              </li>

              <li>
                <button
                  className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={connectWebsite}
                >
                  {connected === true ? "Connected" : "Connect Wallet"}
                </button>
              </li>

              {connected === true && (
                <li>
                  <button
                    className="enableEthereumButton bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm ml-2 mr-4"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? ""
          : "Not Connected. Please login to view Investments"}{" "}
      </div>
    </div>
  );
}

export default Navbar;
