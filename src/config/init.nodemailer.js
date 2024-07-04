"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_APP_ACCOUNT, // APP PASSWORD GOOGLE
    pass: process.env.EMAIL_APP_PASSWORD, // APP PASSWORD GOOGLE
  },
});

const sendEmailNodeMailer = ({ to, subject, htmlContent }) => {
  const mailOptions = {
    from: `Admin E-commerce <${process.env.EMAIL_APP_ACC}>`,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendEmailNodeMailer };
