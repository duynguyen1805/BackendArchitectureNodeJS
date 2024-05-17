"use strict";
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      require: false,
    },
    images: { type: Array, required: true, default: [] },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: false,
    },
    properties: {
      type: Array,
      required: false,
      default: [],
    },
  },
  {
    collections: "Products",
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Products", productSchema);
