"use strict";

const UploadService = require("../services/upload.service");
const SuccessResponse = require("../core/success.response");

class UploadController {
  uploadProduct = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Upload Product successfully",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();
