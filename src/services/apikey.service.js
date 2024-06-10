"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("crypto");

const findById_apikey = async (key) => {
  //   const NewApiKey = await apiKeyModel.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: "0000",
  //   });
  //   console.log(NewApiKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById_apikey: findById_apikey,
};
