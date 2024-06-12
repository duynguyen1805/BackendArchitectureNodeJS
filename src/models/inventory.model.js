"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Inventories";
const document_name = "Inventory";

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
  {
    inven_productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknow" },
    inven_stock: {
      type: Number,
      require: true,
    },
    inven_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    inven_reservations: {
      // { quantity: 10, userId: Number } đặt chỗ
      /*
        cartId: "abc",
        stock: 1,
        createdOn: "2022-01-01T00:00:00.000Z",
      */
      type: Array,
      default: [],
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, inventorySchema);
