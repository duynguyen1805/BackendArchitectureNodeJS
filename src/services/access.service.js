"use strict";
const userSchema = require("../models/user.model");
// hash pwd
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const crypto = require("node:crypto");

const { ROLE } = require("../../constant");

const { createTokenPair, verifyJWT } = require("../auth/authUtils");

const { getInfoData } = require("../utils/index");

const errResponse = require("../core/error.response");

// SERVICE
const KeyTokenService = require("./keyToken.service");
const {
  findByPhonenumber,
  findUserByEmailWithLogin,
} = require("../services/user.service");

const { sendEmailToken } = require("./email.service");

const { foundEmailToken } = require("./otp.service");

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
  /* 
   1 - check token da su dung
   Mục đích: sử dụng để tạo 1CẶP refresh và access token mới
  */
  static handlerRefreshToken = async (refreshToken) => {
    const found_Token = await KeyTokenService.find_ByRefreshTokenUsed(
      refreshToken
    );
    // nếu refreshtoken đã sử dụng rồi >>> đặt nghi vấn
    if (found_Token) {
      // decode check thông tin >> payload >>> { userId }
      const { userId, phonenumber } = await verifyJWT(
        refreshToken,
        found_Token.privateKey
      );
      console.log(
        "Thong tin user từ refreshToken bị nghi vấn: ",
        userId,
        phonenumber
      );
      // xóa tất cả token trong keyStore by userId
      await KeyTokenService.deletekeyStore_byuserId(userId);
      throw new errResponse.ForbiddenError("Something wrong! Please relogin");
    }

    // handle nếu refresh token sử dụng lần đầu tiên (refresh login hiện tại)
    const holderToken = await KeyTokenService.find_ByRefreshToken(refreshToken);
    // chưa có holderToken >> chưa login
    if (!holderToken) {
      throw new errResponse.UnauthorizedError(
        "Invalid refresh token - User not login yet"
      );
    }
    // có holderToken >> verify refreshToken bằng privateKey trong DB.
    const { userId, phonenumber } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // console.log("Thong tin user từ refreshToken: ", userId, phonenumber);
    // check user exists
    const foundUser = await findByPhonenumber({ phonenumber });
    if (!foundUser) {
      throw new errResponse.UnauthorizedError("User not found");
    }

    // tạo cặp token mới (access & refresh) và add refreshToken hiện tại vào refreshTokensUsed
    const tokens = await createTokenPair(
      { userId: foundUser._id, phonenumber: foundUser.phonenumber },
      holderToken.publicKey,
      holderToken.privateKey
    );
    // update cặp token mới
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // RT đã sử dụng để lấy token mới rồi
      },
    });

    return {
      user: { userId, phonenumber },
      tokens,
    };
  };

  static handlerRefreshToken_Ver2 = async ({
    refreshToken,
    user,
    keyStore,
  }) => {
    const { userId, phonenumber } = user;
    // check nếu refreshtoken đã sử dụng rồi >>> đặt nghi vấn
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // xóa tất cả token trong keyStore by userId
      await KeyTokenService.deletekeyStore_byuserId(userId);
      throw new errResponse.ForbiddenError("Something wrong! Please relogin");
    }

    // handle nếu refresh token sử dụng lần đầu tiên (refresh login hiện tại)
    if (keyStore.refreshToken !== refreshToken) {
      throw new errResponse.UnauthorizedError(
        "Invalid refresh token - User not login yet"
      );
    }

    // check nếu RT có tồn tại >> check user nào ?
    const foundUser = await findByPhonenumber({ phonenumber });
    // check user exists
    if (!foundUser) {
      throw new errResponse.UnauthorizedError("User not found");
    }
    // tạo cặp token mới (access & refresh) và add refreshToken hiện tại vào refreshTokensUsed
    const tokens = await createTokenPair(
      { userId: foundUser._id, phonenumber: foundUser.phonenumber },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // update cặp token mới
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // RT đã sử dụng để lấy token mới rồi
      },
    });

    return {
      user,
      tokens,
    };
  };

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
          { userId: newUser._id, phonenumber: newUser.phonenumber },
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

  static signUpByEmail = async (data_body) => {
    // { email = req.body.email, capcha = null }
    const { email } = data_body;
    // 1. check email exist in db
    const user = await userSchema.findOne({ email }).lean();

    // 2. if exists
    if (user) {
      throw new errResponse.BadRequestError({
        message: "Email is already exists, go to login",
      });
    }

    // 3. if not exists => send token via email user
    sendEmailToken({ email: email });
    return {
      message: "Please check email to verify",
    };
  };

  static checkRegisterEmailToken = async (data_body) => {
    const { token, email } = data_body;
    try {
      // check token exists
      const { otp_email, otp_token } = await foundEmailToken({ token, email });
      if (!otp_email || !otp_token) {
        throw new errResponse.BadRequestError("Token not found");
      }

      // check email exists
      const hasUser = await findUserByEmailWithLogin({ email });
      if (hasUser) {
        throw new errResponse.BadRequestError("Email already exists");
      }

      // process hashPassword
      let data_signup = {
        name: email,
        phonenumber: email,
        email: email,
      };
      let hashPasswordfromBcrypt = await hashUserPassword(email);
      if (hashPasswordfromBcrypt && hashPasswordfromBcrypt.code == 0) {
        data_signup.password = hashPasswordfromBcrypt.hashpwd;
      } else {
        throw new errResponse.InternalServerError("hash password error");
      }
      // create user
      const newUser = await userSchema.create({
        ...data_signup,
        role: ROLE.USER,
      });

      if (newUser) {
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
          { userId: newUser._id, phonenumber: newUser.phonenumber },
          publicKey,
          privateKey
        );

        return {
          success: true,
          metadata: {
            user: getInfoData({
              fileds: ["_id", "name", "phonenumber"],
              object: newUser,
            }),
            tokens: tokens,
          },
        };
      } else {
        throw new errResponse.InternalServerError("Error Check Register Email");
      }
    } catch (error) {
      throw new errResponse.InternalServerError(error);
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
      { userId: foundUser._id, phonenumber: foundUser.phonenumber },
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
