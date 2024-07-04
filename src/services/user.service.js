"use strict";

const userModel = require("../models/user.model");

const findByPhonenumber = async ({
  phonenumber,
  select = {
    name: 1,
    phonenumber: 1,
    password: 1,
    email: 1,
    gender: 1,
    birthday: 1,
    avatar: 1,
    status: 1,
    verify: 1,
    role: 1,
  },
}) => {
  return await userModel.findOne({ phonenumber }).select(select).lean();
};

const findUserByEmailWithLogin = async ({ email }) => {
  return await userModel.findOne({ email }).lean();
};

module.exports = {
  findByPhonenumber,
  findUserByEmailWithLogin,
};
