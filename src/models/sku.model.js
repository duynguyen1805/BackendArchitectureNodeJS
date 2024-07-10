"use strict";

const mongoose = require("mongoose"); // Erase if already required

const collection_name = "SKUs";
const document_name = "SKU";

// Declare the Schema of the Mongo model
var productSKUSchema = new mongoose.Schema(
  {
    // string "{spu_id}12345-{shopId}"
    sku_id: {
      type: String,
      required: true,
      unique: true,
    },
    /*
        color = [red, green, blue] = [0, 1, 2]
        size = [S, M, L] = [0, 1, 2]
        sku_tier_index: [0, 0], [1, 2]
    */
    sku_tier_index: {
      type: Array,
      default: [0],
    },
    sku_default: {
      type: Boolean,
      default: false,
    },
    sku_slug: {
      type: String,
      default: "",
    },
    sku_sort: {
      type: Number,
      default: 0,
    },
    sku_price: {
      type: String,
      required: true,
    },
    sku_stock: {
      type: Number, // or Array in of stock
      default: 0,
    },
    product_id: { type: String, required: true }, // ref to spu product (SPU)

    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false },
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
module.exports = mongoose.model(document_name, productSKUSchema);
