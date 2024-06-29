"use strict";
require("dotenv").config();
const winston = require("winston");
require("winston-daily-rotate-file");
const { combine, json, timestamp, align, printf } = winston.format;

const { v4: uuidv4 } = require("uuid");

/*
    5 level
    error,
    warning,
    info,
    debug,
    requestId or traceId
*/
class MyLogger {
  constructor() {
    const formatPrint = winston.format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `[${timestamp}]::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: "info",
          dirname: "src/logs",
          filename: "application-%DATE%.info.log", // theo datePattern
          datePattern: "YYYY-MM-DD", // theo giờ "YYYY-MM-DD-HH"
          zippedArchive: true, // true: backup log zipped archive
          maxSize: "20m", // dung lượng file
          maxFiles: "14d", // xóa log trong vòng 14 ngày
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
            formatPrint
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          dirname: "src/logs",
          filename: "application-%DATE%.error.log", // theo datePattern
          datePattern: "YYYY-MM-DD", // theo giờ "YYYY-MM-DD-HH"
          zippedArchive: true, // true: backup log zipped archive
          maxSize: "20m", // dung lượng file
          maxFiles: "14d", // xóa log trong vòng 14 ngày
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
            formatPrint
          ),
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata; // context => file gi o dau ham nao; req: req.body; metadata: response
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();

    return {
      requestId,
      context: context,
      metadata: metadata,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.info(logObject);
  }
  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
