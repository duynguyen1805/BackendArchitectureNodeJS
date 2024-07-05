"use strict";
require("dotenv").config();
// ES6
const AccessService = require("../services/access.service");
const successResponse = require("../core/success.response");
const errResponse = require("../core/error.response");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new successResponse.OK({
      message: "Lấy accessToken mới thành công",
      metadata: await AccessService.handlerRefreshToken_Ver2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
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

  signUpByEmail = async (req, res, next) => {
    new successResponse.OK({
      message: "Send verify email successfully",
      metadata: await AccessService.signUpByEmail(req.body),
    }).send(res);
  };

  // check user token via Email
  checkRegisterEmailToken = async (req, res, next) => {
    const { token = null, email } = req.query;
    // new successResponse.OK({
    //   message: "Check register email token successfully",
    //   metadata: await AccessService.checkRegisterEmailToken({ token, email }),
    // }).send(res);
    const result = await AccessService.checkRegisterEmailToken({
      token,
      email,
    });
    if (result.success) {
      const { user, tokens } = result.metadata;
      return res.redirect(
        `${process.env.URL_FRONTEND}/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } else {
      return res.redirect(
        `${process.env.URL_FRONTEND}/failed-verify-your-email`
      );
    }
  };

  login = async (req, res, next) => {
    const { phonenumber, password } = req.body;
    if (!phonenumber || !password) {
      throw new errResponse.BadRequestError(
        "Missing input Login! Check and tryagain."
      );
    }
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
