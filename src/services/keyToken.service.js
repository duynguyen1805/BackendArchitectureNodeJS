"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

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

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // LEVEL 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKey.toString(),
      //   privateKey: privateKey.toString(),
      // });
      // return tokens
      //   ? { publicKey: tokens.publicKey, privateKey: tokens.privateKey }
      //   : null;

      // LEVEL 1
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokensUsed: [],
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens
        ? { publicKey: tokens.publicKey, privateKey: tokens.privateKey }
        : null;
    } catch (error) {
      return "Lỗi created token: ", error;
    }
  };

  static findKey_ByUserId = async (userId) => {
    const objKey = await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
    return objKey;
  };

  static deleteKey_ById = async (id_keyStore) => {
    const objKey = await keyTokenModel
      .findOneAndDelete({ _id: new Types.ObjectId(id_keyStore) })
      .lean();
    return {
      _id_keyStore: objKey._id,
      user: objKey.user,
    };
  };
  // static deleteKey_ById = async ({ id }) => {
  //   const result = await keyTokenModel.deleteOne({
  //     _id: new Types.ObjectId(id),
  //   });
  //   return result;
  // };

  static find_ByRefreshTokenUsed = async (refreshToken) => {
    const objKey = await keyTokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
    return objKey;
  };

  static deletekeyStore_byuserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  };

  static find_ByRefreshToken = async (refreshToken) => {
    const objKey = await keyTokenModel.findOne({
      refreshToken: refreshToken,
    });
    return objKey;
  };
}

module.exports = KeyTokenService;
