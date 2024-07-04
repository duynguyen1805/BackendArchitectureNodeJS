"use strict";
require("dotenv").config();

const htmlEmailToken = () => {
  //   const verificationLink = `${process.env.URL_FRONTEND}/verify?token=${token}&email=${email}`;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 50px auto;
            padding: 20px;
            max-width: 600px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 100px;
        }
        .content {
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://via.placeholder.com/100" alt="Logo">
        </div>
        <div class="content">
            <h1>Verify Your Email Address</h1>
            <p>Hello,</p>
            <p>Thank you for registering with our service. Please click the button below to verify your email address.</p>
            <a href="{{verificationLink}}" class="button">Verify Email</a>
        </div>
        <div class="footer">
            <p>If you did not request this email, please ignore it.</p>
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};
const htmlEmailToken_v2 = (token, email) => {
  const verificationLink = `${process.env.URL_FRONTEND}/verify?token=${token}&email=${email}`;
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              background-color: #ffffff;
              margin: 50px auto;
              padding: 20px;
              max-width: 600px;
              border: 1px solid #dddddd;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding-bottom: 20px;
          }
          .header img {
              max-width: 100px;
          }
          .content {
              text-align: center;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #28a745;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
          }
          .footer {
              text-align: center;
              padding-top: 20px;
              color: #888888;
              font-size: 12px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="https://via.placeholder.com/100" alt="Logo">
          </div>
          <div class="content">
              <h1>Verify Your Email Address</h1>
              <p>Hello,</p>
              <p>Thank you for registering with our service. Please click the button below to verify your email address.</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
          </div>
          <div class="footer">
              <p>If you did not request this email, please ignore it.</p>
              <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
      `;
};

module.exports = { htmlEmailToken, htmlEmailToken_v2 };
