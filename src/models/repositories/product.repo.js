"use strict";

const {
  ProductSchema,
  ClothingSchema,
  ElectronicSchema,
  FurnitureSchema,
} = require("../product.model");

const findAll_DraftsProduct_ByShop = async ({ query, limit, skip }) => {
  return await ProductSchema.find(query)
    .populate("product_shop", "name phonenumber _id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = { findAll_DraftsProduct_ByShop };
