"use strict";
const discountModel = require("../../models/discount.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findDiscount = async ({ code, shopId }) => {
  return await discountModel
    .findOne({
      discount_code: code,
      discount_shop: convert_toObjectId_MongoDB(shopId),
    })
    .lean();
};

const findAll_DiscountCodes_ByShop_unSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect)) // accept object => convert arr to object (utils)
    .lean();

  return discounts;
};

const findAll_DiscountCodes_ByShop_Select = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  Select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(Select)) // accept object => convert arr to object (utils)
    .lean();

  return discounts;
};

module.exports = {
  findDiscount,
  findAll_DiscountCodes_ByShop_unSelect,
  findAll_DiscountCodes_ByShop_Select,
};
