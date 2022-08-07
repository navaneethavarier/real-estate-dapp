import "./App.css";
import Navbar from "./components/Navbar.js";
import Listings from "./components/Listings";
import Account from "./components/Account";
import CreateListing from "./components/CreateListing";
import ListingDetails from "./components/ListingDetails";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login1 from "./components/Login1";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/listingdetails" element={<ListingDetails />} />
        <Route path="/account" element={<Account />} />
        <Route path="/createListing" element={<CreateListing />} />
      </Routes>
    </div>
  );
}

export default App;

// 0x500Ef368D055319a3C31419806067EeF42ed4f3b
