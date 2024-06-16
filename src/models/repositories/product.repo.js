"use strict";

const { Types } = require("mongoose");
const {
  ProductSchema,
  ClothingSchema,
  ElectronicSchema,
  FurnitureSchema,
} = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

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

const findAll_Products = async ({ limit, sort, page, filter, select }) => {
  // public, product homepage, no search
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await ProductSchema.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select)) // accept object => convert arr to object (utils)
    .lean();

  return products;
};

const find_DetailProduct = async ({ product_id, unSelect }) => {
  return await ProductSchema.findById(product_id).select(
    unGetSelectData(unSelect)
  );
};

const update_ProductById = ({
  product_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew });
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
    {
      new: true,
      //overwrite: true, // đảm bảo thay thế toàn bộ tài liệu (chuẩn method PUT)
    } // return new product after update
  );
};

const searchProducts_ByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await ProductSchema.find(
    {
      isPublished: true,
      $text: { $search: regexSearch },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

const findProduct_ById = async ({ productId }) => {
  return await ProductSchema.findById(productId).lean();
};

module.exports = {
  findAll_DraftsProduct_ByShop,
  publish_Product_ByShop,
  findAll_PublishedProduct_ByShop,
  unPublish_Product_ByShop,
  searchProducts_ByUser,
  findAll_Products,
  find_DetailProduct,
  update_ProductById,
  findProduct_ById,
};
