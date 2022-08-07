import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Listings from "./components/Listings";
import Account from "./components/Account";
import CreateListing from "./components/CreateListing";
import ListingDetails from "./components/ListingDetails";
import Login1 from "./components/Login1";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/listingdetails/:tokenId" element={<ListingDetails />} />
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
