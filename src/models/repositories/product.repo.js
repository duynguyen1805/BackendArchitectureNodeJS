"use strict";

const { Types } = require("mongoose");
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

const findAll_PublishedProduct_ByShop = async ({ query, limit, skip }) => {
  return await ProductSchema.find(query)
    .populate("product_shop", "name phonenumber _id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publish_Product_ByShop = async ({ product_shop, product_id }) => {
  return await ProductSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    },
    { isDraft: false, isPublished: true },
    { new: true } // return new product after update
  );
};

const unPublish_Product_ByShop = async ({ product_shop, product_id }) => {
  return await ProductSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    },
    { isPublished: false, isDraft: true },
    { new: true } // return new product after update
  );
};

module.exports = {
  findAll_DraftsProduct_ByShop,
  publish_Product_ByShop,
  findAll_PublishedProduct_ByShop,
  unPublish_Product_ByShop,
};
