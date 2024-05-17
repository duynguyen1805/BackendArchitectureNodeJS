"use strict";
const userSchema = require("../models/user.model");
// hash pwd
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const crypto = require("node:crypto");

const { ROLE } = require("../../constant");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const { getInfoData } = require("../utils/index");

const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");

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
  static signUp = async (data_body) => {
    const { name, phonenumber, password, gender, birthday, role } = data_body;
    // try {
    // check phonenumber exists
    let existphone = await check_exist_phonenumber(phonenumber);
    if (existphone === true) {
      // return {
      //   code: 400,
      //   message: "phonenumber already exists",
      // };

      // handle error
      throw new BadRequestError("Error: phonenumber already exists");
    } else {
      // process hashPassword
      let hashPasswordfromBcrypt = await hashUserPassword(password);
      if (hashPasswordfromBcrypt && hashPasswordfromBcrypt.code == 0) {
        data_body.password = hashPasswordfromBcrypt.hashpwd;
      } else {
        return { code: 400, message: "hash pwd error" };
      }
      // create user
      const newUser = await userSchema.create({
        ...data_body,
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

        console.log("check 2keys: ", privateKey, publicKey);

        // publicKeyString ::V2
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey: publicKey,
          privateKey: privateKey,
        });

        if (!keyStore) {
          return {
            code: 400,
            message: "Error creating keyStore",
          };
        }
        // console.log("check keyStore: ", keyStore);

        const tokens = await createTokenPair(
          { userId: newUser._id },
          publicKey,
          privateKey
        );

        return {
          code: 200,
          metadata: {
            user: getInfoData({
              fileds: ["_id", "name", "phonenumber"],
              object: newUser,
            }),
            tokens: tokens,
          },
        };
      } else {
        return {
          code: 500,
          metadata: null,
          message: "Lưu vào DB lỗi. Lỗi connect DB. ",
        };
      }
    }
    // }
    // catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
