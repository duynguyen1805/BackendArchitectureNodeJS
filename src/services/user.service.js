"use strict";

const userModel = require("../models/user.model");

const findByPhonenumber = async ({
  phonenumber,
  select = {
    name: 1,
    phonenumber: 1,
    // password: 0, không thể có 0 và 1 trong 1 obj select
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

module.exports = {
  findByPhonenumber,
};
