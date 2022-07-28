const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const propertySchema = new mongoose.Schema(
  {
    propid: {
      type: Number,
    },
    address: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    city: {
      type: String,
      trim: true,
      required: true,
      maxlength: 20,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    status: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    certificateid: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema, "property");
//returns null when module.exports = mongoose.model("Property", propertySchema);
//refer var Model = mongoose.model("Model", fileSchema, "pure name your db collection");
//Fix ---- var Model = mongoose.model("Model", fileSchema, "name of your db collection");
