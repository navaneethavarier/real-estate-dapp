//require('dotenv').config();
// const key = process.env.REACT_APP_PINATA_KEY;
// const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require("axios");
const FD = require("form-data");

export const uploadJSONToIPFS = async (json) => {
  const URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  return axios
    .post(URL, json, {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
      },
    })
    .then((res) => {
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (f) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let fdata = new FD();
  fdata.append("file", f);

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  fdata.append("pinataMetadata", metadata);

  //pinataOptions are optional
  // const pinataOptions = JSON.stringify({
  //   cidVersion: 0,
  //   customPinPolicy: {
  //     regions: [
  //       {
  //         id: "FRA1",
  //         desiredReplicationCount: 1,
  //       },
  //       {
  //         id: "NYC1",
  //         desiredReplicationCount: 2,
  //       },
  //     ],
  //   },
  // });
  // data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, fdata, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${fdata._boundary}`,
        pinata_api_key: process.env.REACT_APP_PINATA_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
      },
    })
    .then((res) => {
      // console.log("image uploaded", res.data.IpfsHash);
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        message: err.message,
      };
    });
};

export const updateJSON = async (json) => {
  const URL = "https://api.pinata.cloud/pinning/hashMetadata";

  return axios
    .put(URL, JSON.stringify(json), {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
      },
    })
    .then((res) => {
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

// API Key: 9f7999544270d9310cf4
//  API Secret: 004a22c05477e993b9984d14aa168ba8c0bcf788df89dd637f836622f6c2abd8
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZDM4MWY2OC0xZDgzLTQxNTEtYTM0MS1jYzc1Y2MzZDIxNDQiLCJlbWFpbCI6InZhcmllci5uYXZhbmVldGhhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5Zjc5OTk1NDQyNzBkOTMxMGNmNCIsInNjb3BlZEtleVNlY3JldCI6IjAwNGEyMmMwNTQ3N2U5OTNiOTk4NGQxNGFhMTY4YmE4YzBiY2Y3ODhkZjg5ZGQ2MzdmODM2NjIyZjZjMmFiZDgiLCJpYXQiOjE2NTg0MTU1NDJ9.2obL7hYJLES7UqCgi1W-s-S4zGjdzfKoFkdJMpp_KUg
