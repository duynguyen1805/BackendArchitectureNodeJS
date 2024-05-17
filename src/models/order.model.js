"use strict";
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cartId: {
      type: String,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    payment: {
      type: Object,
      required: true,
    },
    products: { type: Array, required: true, default: [] },
  },
  {
    collections: "Orders",
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Orders", orderSchema);
