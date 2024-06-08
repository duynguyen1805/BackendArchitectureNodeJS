"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Products";
const document_name = "Product";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumbnail: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      // enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collections: collection_name,
    timestamps: true,
  }
);

// define the product type = "Electronics", "Clothing", "Furniture"
const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    collection: "Furniture",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  ProductSchema: mongoose.model(document_name, productSchema),
  ClothingSchema: mongoose.model("Clothing", clothingSchema),
  ElectronicSchema: mongoose.model("Electronic", electronicSchema),
  FurnitureSchema: mongoose.model("Furniture", furnitureSchema),
};
