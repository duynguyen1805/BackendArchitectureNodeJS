"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Discounts";
const document_name = "Discount";

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed-amount", // [fixed-amount, percentage]
    },
    discount_value: {
      type: Number, // 20.000 or 10%
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number, // số lượng tối đa
      required: true,
    },
    discount_max_uses_per_user: {
      type: Number, // số lượng tối đa cho 1 người áp dụng
      required: true,
    },
    discount_uses_count: {
      type: Number, // discount đã sử dụng
      require: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    discount_isActive: {
      type: Boolean,
      default: true,
    },
    discount_applied_to: {
      type: String,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array, // số sản phẩm áp dụng
      default: [],
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, discountSchema);

/**
 * các trường hợp discount áp dụng:
 * 1. discount sử dụng cho 1 specific product
 * 2. discount sử dụng cho all products of shop
 * 3. discount sử dụng cho 1 loại danh mục (category) (CHƯA CÓ)
 */
