"use strict";
require("dotenv").config();
const errResponse = require("../core/error.response");
const { newOTP } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { htmlEmailToken_v2 } = require("../utils/template.html");
const { sendEmailNodeMailer } = require("../config/init.nodemailer");

const sendMailLinkVerify = ({
  html,
  toEmail,
  subject = "Xác nhận Email Đăng ký",
}) => {};

const sendEmailToken = async ({ email }) => {
  if (!email) {
    throw new errResponse.BadRequestError({
      message: "[email.service] Missing email",
    });
  }

  try {
    // get Token
    const token = await newOTP({ email });

    // get email template
    // const template = await getTemplate({ temp_name: "HTML_EMAIL_VERIFY" });

    // -------------------------------------------------------------------------
    // get truc tiep template
    const template = htmlEmailToken_v2(token.otp_token, token.otp_email);

    // send email
    sendEmailNodeMailer({
      to: token.otp_email,
      subject: "Verify Email",
      htmlContent: template,
    });
    // -------------------------------------------------------------------------
  } catch (error) {}
};

module.exports = {
  sendEmailToken,
};
