const express = require("express");
const router = express.Router();

const {
  getAllProperties,
  getPropertyById,
  createNewProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/property");

//listing routes
router.get("/propertylist", getAllProperties);
router.get("/propertyById/:propID", getPropertyById);
router.post("/newprop", createNewProperty);
router.patch("/updateprop/:id", updateProperty);
router.delete("/deleteprop/:id", deleteProperty);

module.exports = router;
