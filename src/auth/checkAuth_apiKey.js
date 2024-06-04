"use strict";

const { findById_apikey } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

// check api key exists
const check_apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check object Key có exist trong db ?
    const objKey = await findById_apikey(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error findById_apikey",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error(error);
  }
};

// check permissions apiKey
const checkPermissions_apiKey = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    console.log("permissions: " + req.objKey.permissions);
    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

module.exports = {
  check_apiKey,
  checkPermissions_apiKey,
};
