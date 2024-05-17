"use strict";

const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now(),
    },
    products: { type: Array, default: [], required: true },
  },
  {
    collection: "Carts",
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Carts", cartSchema);
