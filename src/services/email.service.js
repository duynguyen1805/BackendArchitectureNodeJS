"use strict";
require("dotenv").config();
const errResponse = require("../core/error.response");
const { newOTP } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { htmlEmailToken_v2 } = require("../utils/template.html");
const { replacePlaceholder } = require("../utils/index");
const {
  transporter,
  sendEmailNodeMailer,
} = require("../config/init.nodemailer");

const sendMailLinkVerify = async ({
  html,
  toEmail,
  subject = "Xác nhận Email Đăng ký",
}) => {
  try {
    const mailOptions = {
      from: `Admin E-commerce - <${process.env.EMAIL_APP_ACC}>`,
      to: toEmail,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log("transporter error: ", error);
      console.log("transporter send mail success: ", info.messageId);
    });
  } catch (error) {
    console.error("[email.service] sendMailLinkVerify: ", error);
    return error;
  }
};

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
    const template = await getTemplate({ temp_name: "HTML_EMAIL_VERIFY" });

    if (!template) {
      throw new errResponse.BadRequestError({
        message: "[email.service] Missing template",
      });
    }

    // replace placeHolder with params
    const content_html = replacePlaceholder(template.temp_html, {
      verificationLink: `http://localhost:4000/v1/api/email/verify?token=${token.otp_token}&email=${token.otp_email}`,
    });

    // send email
    sendMailLinkVerify({
      html: content_html,
      toEmail: email,
      subject: "Xác nhận Email Đăng ký",
    });

    return 1;

    /* -------------------------------------------------------------------------
    // get truc tiep template
    const template = htmlEmailToken_v2(token.otp_token, token.otp_email);

    // send email
    sendEmailNodeMailer({
      to: token.otp_email,
      subject: "Verify Email",
      htmlContent: template,
    });
    ------------------------------------------------------------------------- */
  } catch (error) {
    throw new Error("[email.service] sendEmailToken: ", error);
  }
};

module.exports = {
  sendEmailToken,
};
