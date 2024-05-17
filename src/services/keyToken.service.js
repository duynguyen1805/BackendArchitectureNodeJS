"use strict";

const keyTokenModel = require("../models/keyToken.model");

// tao token luu vao db

class KeyTokenService {
  // static createKeyToken = async ({ userId, publicKey }) => {
  //   try {
  //     const publicKeyString = publicKey.toString(); // publicKey is buffer => toString de luu vao db
  //     const tokens = await keyTokenModel.create({
  //       user: userId,
  //       publicKey: publicKeyString,
  //     });

  //     return tokens ? tokens.publicKey : null;
  //   } catch (error) {
  //     return "Lỗi created token: ", error;
  //   }
  // };
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
      });

      return tokens
        ? { publicKey: tokens.publicKey, privateKey: tokens.privateKey }
        : null;
    } catch (error) {
      return "Lỗi created token: ", error;
    }
  };
}

module.exports = KeyTokenService;
