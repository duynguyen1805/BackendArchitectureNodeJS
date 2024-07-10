"use strict";
const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const collection_name = "SPUs";
const document_name = "SPU";

// Declare the Schema of the Mongo model
const productSPUSchema = new mongoose.Schema(
  {
    // customize product id
    product_id: {
      type: String,
      default: "",
    },
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
    product_category: { type: Array, default: [] },
    // product_type: {
    //   type: String,
    //   required: true,
    //   // enum: ["Electronic", "Clothing", "Furniture"],
    // },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    /*
        {
            attribute_id: 1234, // style áo [mùa đông, hàn quốc, mùa hè]
            attribute_value: [
                {
                    value_id: 1234,
                }
            ]
        }
    */
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    /*
        tier_variations: [
            {
                image: [],
                name: 'color',
                options: ['red', 'blue', 'green']
            },
            {
                image: [],
                name: 'size',
                options: ['S', 'M', 'L', 'XL', 'XXL']
            }
        ]
    */
    product_variations: {
      type: Array,
      default: [],
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
    // isDraft: { type: Boolean, default: true, index: true, select: false },
    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collections: collection_name,
    timestamps: true,
  }
);

// Create index full-text search
productSPUSchema.index({ product_name: "text", product_description: "text" });
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSPUSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = mongoose.model(document_name, productSPUSchema);
