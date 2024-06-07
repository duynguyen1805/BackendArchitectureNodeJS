"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const errResponse = require("../core/error.response");
// SERVICE
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing ?
    2 - get accessToken
    3 - verifyToken
    4 - check user inDB
    5 - check keyStore with this userId
    6 - ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId)
    throw new errResponse.BadRequestError("Invalid Request - Missing userId");

  const keyStore = await KeyTokenService.findKey_ByUserId(userId);
  if (!keyStore)
    throw new errResponse.NotFoundError("Not found keyStore of User");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken)
    throw new errResponse.BadRequestError(
      "Invalid Request - Missing accessToken"
    );
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId) {
      throw new errResponse.BadRequestError("Invalid userId");
    }

    req.keyStore = keyStore;
    req.user = decodeUser; // { userId, phonenumber }
    return next();
  } catch (error) {
    throw error;
  }
});

const authentication_Ver2 = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing ?
    2 - get accessToken
    3 - verifyToken
    4 - check user inDB
    5 - check keyStore with this userId
    6 - ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId)
    throw new errResponse.BadRequestError("Invalid Request - Missing userId");

  const keyStore = await KeyTokenService.findKey_ByUserId(userId);
  if (!keyStore)
    throw new errResponse.NotFoundError("Not found keyStore of User");

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId != decodeUser.userId) {
        throw new errResponse.BadRequestError("Invalid userId");
      }

      req.keyStore = keyStore;
      req.user = decodeUser; // { userId, phonenumber }
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken)
    throw new errResponse.BadRequestError(
      "Invalid Request - Missing accessToken"
    );
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId) {
      throw new errResponse.BadRequestError("Invalid userId");
    }

    req.keyStore = keyStore;
    req.user = decodeUser; // { userId, phonenumber }
    return next();
  } catch (error) {
    throw error;
  }
});

/** props token có thể là >> [accessToken, refreshToken] */
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authentication_Ver2,
  verifyJWT,
};
