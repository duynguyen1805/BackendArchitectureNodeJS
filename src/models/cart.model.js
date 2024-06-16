"use strict";

const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Carts";
const document_name = "Cart";

// type cart_products = [
//   {
//     productId,
//     shopId,
//     quantity,
//     name,
//     price
//   }
// ]

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      default: "active",
      required: true,
      enum: ["active", "completed", "failed", "pending"],
    },
    cart_products: { type: Array, default: [], required: true },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    collection: collection_name,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

//Export the model
module.exports = {
  cartSchema: mongoose.model(document_name, cartSchema),
};
