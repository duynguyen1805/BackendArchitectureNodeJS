"use strict";
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      // cart(10item) => quantity - 10
      type: Number,
      require: true,
    },
    reservations: {
      // { quantity: 10, userId: Number } đặt chỗ
      type: Array,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "Inventories",
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Inventories", inventorySchema);
