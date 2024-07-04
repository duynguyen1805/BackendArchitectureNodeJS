"use strict";

const { sendEmailToken } = require("../services/email.service");
const { newTemplate } = require("../services/template.service");
const SuccessResponse = require("../core/success.response");
const errResponse = require("../core/error.response");

class EmailController {
  newTemplate = async (req, res, next) => {
    const { temp_name } = req.body;
    if (!temp_name) {
      return new errResponse.BadRequestError("Missing temp_name");
    }
    new SuccessResponse.OK({
      message: "Success new template",
      metadata: await newTemplate({ temp_name }),
    }).send(res);
  };

  sendEmailToken = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return new errResponse.BadRequestError("Missing email");
    }
    new SuccessResponse.OK({
      message: "Success send email",
      metadata: await sendEmailToken({ email }),
    }).send(res);
  };

  verifyEmail = async (req, res, next) => {
    const { token, email } = req.body;
    if (!token || !email) {
      return new errResponse.BadRequestError("Missing token or email");
    }
    new SuccessResponse.OK({
      message: "Success verify email",
      metadata: await sendEmailToken({ token, email }),
    }).send(res);
  };
}

module.exports = new EmailController();
