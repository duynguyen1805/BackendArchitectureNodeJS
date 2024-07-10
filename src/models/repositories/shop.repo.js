"use strict";

const userSchema = require("../user.model");

const selectStruct = {
  name: 1,
  phonenumber: 1,
  email: 1,
  role: 1,
  usr_role: 1,
  status: 1,
};

const findShopById = async ({ shopId, select = selectStruct }) => {
  return await userSchema.findOne({ _id: shopId }).select(select).lean();
};

module.exports = { findShopById };
