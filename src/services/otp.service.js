"use strict";
const otpSchema = require("../models/otp.model");
const { randomInt } = require("crypto");

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

module.exports = { generatorTokenRandom, newOTP };
