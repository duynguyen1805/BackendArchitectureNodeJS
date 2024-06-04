"use strict";
const userSchema = require("../models/user.model");
// hash pwd
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const crypto = require("node:crypto");

const { ROLE } = require("../../constant");

const { createTokenPair } = require("../auth/authUtils");

const { getInfoData } = require("../utils/index");

const errResponse = require("../core/error.response");

// SERVICE
const KeyTokenService = require("./keyToken.service");
const { findByPhonenumber } = require("../services/user.service");

const check_exist_phonenumber = async (number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let phonenumber = await userSchema
        .findOne({ phonenumber: number })
        .lean();
      if (phonenumber) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const hashUserPassword = (pwd) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashpwd = await bcrypt.hashSync(pwd, salt);
      if (hashpwd) {
        return resolve({
          code: 0,
          hashpwd: hashpwd,
        });
      } else {
        return resolve({
          code: 1,
          message: "Hash password error !",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

class AccessService {
  static signUp = async (data_signup) => {
    const { name, phonenumber, password, gender, birthday, role } = data_signup;
    // check phonenumber exists
    let existphone = await check_exist_phonenumber(phonenumber);
    if (existphone === true) {
      // return {
      //   code: 400,
      //   message: "phonenumber already exists",
      // };

      // handle error
      throw new errResponse.BadRequestError(
        "Error: phonenumber already exists"
      );
    } else {
      // process hashPassword
      let hashPasswordfromBcrypt = await hashUserPassword(password);
      if (hashPasswordfromBcrypt && hashPasswordfromBcrypt.code == 0) {
        data_signup.password = hashPasswordfromBcrypt.hashpwd;
      } else {
        throw new errResponse.InternalServerError("hash password error");
      }
      // create user
      const newUser = await userSchema.create({
        ...data_signup,
        role: role ? role : ROLE.USER,
      });

      if (newUser) {
        // tạo privateKey (dùng sign token) và publicKey (verify token) => t.toán bất đối xứng (BẢO MẬT HƠN) ::V1
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1", // rsa bất đối xứng
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //     // cipher: "aes-256-cbc",
        //     // passphrase: "top secret",
        //   },
        // });

        // create publicKeyString lưu vào database => chính là publicKey
        // const publicKeyString = await KeyTokenService.createKeyToken({
        //   userId: newUser._id,
        //   publicKey: publicKey,
        // });

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // tạo cặp token (access token & refresh token)
        // const tokens = await createTokenPair(
        //   { userId: newUser._id },
        //   publicKeyObject, // lấy publicKey sau từ database. không lấy khi tạo
        //   privateKey
        // );

        // tạo privateKey và publicKey hệ thống vừa và nhỏ (ĐƠN GIẢN HƠN) ::V2
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // publicKeyString ::V2
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey: publicKey,
          privateKey: privateKey,
        });

        if (!keyStore) {
          throw new errResponse.InternalServerError("Error creating keyStore");
        }
        // console.log("check keyStore: ", keyStore);

        const tokens = await createTokenPair(
          { userId: newUser._id },
          publicKey,
          privateKey
        );

        return {
          metadata: {
            user: getInfoData({
              fileds: ["_id", "name", "phonenumber"],
              object: newUser,
            }),
            tokens: tokens,
          },
        };
      } else {
        throw new errResponse.InternalServerError("Error Creating New User");
      }
    }
  };

  /* 
   1 - check phonenumber
   2 - match password
   3 - create access token & refresh token
   4 - generate tokens
   5 - getdata return login
  */
  static login = async (data_login) => {
    const { phonenumber, password, refreshToken = null } = data_login;

    // 1.
    const foundUser = await findByPhonenumber({ phonenumber });
    if (!foundUser) {
      throw new errResponse.BadRequestError("Phonenumber not registered");
    }

    // 2.
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new errResponse.UnauthorizedError(
        "Authentication error - failed compare pwd"
      );
    }

    // 3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4.
    const tokens = await createTokenPair(
      { userId: foundUser._id },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5.
    return {
      metadata: {
        user: getInfoData({
          fileds: [
            "_id",
            "name",
            "phonenumber",
            "email",
            "gender",
            "birthday",
            "avatar",
            "status",
            "role",
            "verify",
          ],
          object: foundUser,
        }),
        tokens: tokens,
      },
    };
  };

  /* */
  static logout = async (keyStore) => {
    const del_KeyStore = await KeyTokenService.deleteKey_ById(keyStore._id);
    /*
    console.log("check delKeyStore: ", del_KeyStore);
    => { acknowledged: true, deletedCount: 1 }
    */
    return del_KeyStore;
  };
}

module.exports = AccessService;
