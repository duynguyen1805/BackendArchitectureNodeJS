"use strict";
// ES6
const AccessService = require("../services/access.service");
const successResponse = require("../core/success.response");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new successResponse.OK({
      message: "Lấy accessToken mới thành công",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };

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

  login = async (req, res, next) => {
    new successResponse.OK({
      message: "Đăng nhập thành công",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new successResponse.OK({
      message: "Đăng xuất thành công",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();
