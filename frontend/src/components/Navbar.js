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

const buttonstyling = "text-white font-bold py-2 px-4 rounded text-sm";

function Navbar() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const location = useLocation();
  const [currAddress, setCurrAddress] = useState("0x");

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
    setCurrAddress(addr);
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
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();
    console.log(val);

    if (val) {
      getAddress();
      setConnected(val);
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  }, []);

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
          <li className="w-4/6">
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
              <li className="hover:pb-0 p-2">
                <Link to="/myinvestments">My Investments</Link>
              </li>
              <li>
                <button
                  className={`bg-green-500 hover:bg-green-700 ${buttonstyling}`}
                  onClick={connectWebsite}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
              {currAddress !== "0x" && (
                <li>
                  <button
                    className={`bg-red-500 hover:bg-red-700 ${buttonstyling}`}
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
