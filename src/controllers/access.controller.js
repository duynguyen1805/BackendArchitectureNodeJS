"use strict";
// ES6
const AccessService = require("../services/access.service");
const successResponse = require("../core/success.response");

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
    new successResponse.Created({
      message: "Đăng ký thành công",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
