"use strict";
const otpSchema = require("../models/otp.model");
const { randomInt } = require("crypto");
const errResponse = require("../core/error.response");

const generatorTokenRandom = async () => {
  const token = await randomInt(0, Math.pow(2, 32));
  return token;
};

const newOTP = async ({ email }) => {
  const token = await generatorTokenRandom();
  const newToken = await otpSchema.create({
    otp_token: token,
    otp_email: email,
  });
  return newToken;
};

const foundEmailToken = async ({ token, email }) => {
  const foundToken = await otpSchema.findOne({
    otp_token: token,
    otp_email: email,
  });
  if (!foundToken) {
    throw new errResponse.BadRequestError("Email Token not found");
  }

  // delete if found
  otpSchema.deleteOne({ otp_token: foundToken.otp_token }).then();

  return foundToken;
};

module.exports = { generatorTokenRandom, newOTP, foundEmailToken };
