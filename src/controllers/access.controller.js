"use strict";
// ES6
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    // try {
    //   // console.log("[P]::signUp:: ", req.body);
    //   const result = await AccessService.signUp(req.body);
    //   return res.status(200).json(result);
    // } catch (error) {
    //   next(error);
    // }

    // đã có xử lý handle error riêng
    // có dạng json {message, metadata, ...}
    const result = await AccessService.signUp(req.body);
    return res.status(200).json(result);
  };
}

module.exports = new AccessController();
