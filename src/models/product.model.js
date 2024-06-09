"use strict";
const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const collection_name = "Products";
const document_name = "Product";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      // quan jean nam cao cap
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
    product_slug: String, // quan-jean-nam-cao-cap
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
    // MORE
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      // làm tròn
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    // isDraft: { type: Boolean, default: true, index: true, select: false },
    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    collections: collection_name,
    timestamps: true,
  }
);

// Create index full-text search
productSchema.index({ product_name: "text", product_description: "text" });
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
