"use strict";
require("dotenv").config();
const winston = require("winston");

const { combine, json, timestamp, align, printf } = winston.format;

const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  //   format: winston.format.simple(),
  //   defaultMeta: { service: "user-service" },
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(), // auto canh chỉnh
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    /*
        - write all logs with importance level of `error` or less to `error.log`
        - write all logs with importance level of `info` or less to `combined.log`
        */
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: "logs",
      filename: "request_error.log",
    }),
  ],
});

module.exports = Logger;
