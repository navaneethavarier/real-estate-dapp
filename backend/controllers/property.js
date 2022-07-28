const propModel = require("../models/property");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getAllProperties = async (req, res) => {
  try {
    const props = await propModel.find();
    res.status(200).json(props);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const prop = await propModel.findById(req.params.propID);
    res.status(200).json(prop);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createNewProperty = async (req, res) => {
  if (
    !req.body.address &&
    !req.body.city &&
    !req.body.price &&
    !req.body.status &&
    !req.body.certificateid
  ) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const prop = new propModel({
    propid: req.body.propid,
    address: req.body.address,
    city: req.body.city,
    price: req.body.price,
    status: req.body.status,
    certificateid: req.body.certificateid,
  });

  await prop
    .save()
    .then((data) => {
      res.send({
        message: "Property added to the database successfully!",
        prop: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while adding property",
      });
    });
};

exports.updateProperty = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to update cannot be empty",
    });
  }

  const id = req.params.id;

  await propModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(400).send({
          message: "Property Not Found",
        });
      } else {
        res.send({
          message: "Property updated successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.deleteProperty = async (req, res) => {
  console.log(req.params);
  await propModel
    .findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Property not found",
        });
      } else {
        res.send({
          message: "Property deleted successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
