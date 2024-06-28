"use strict";

const UploadService = require("../services/upload.service");
const SuccessResponse = require("../core/success.response");
const errResponse = require("../core/error.response");

class UploadController {
  uploadProduct = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Upload Product successfully",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new errResponse.BadRequestError("uploadFileThumb - file error");
    }

    new SuccessResponse.OK({
      message: "Upload Thumbnail by Multer successfully",
      metadata: await UploadService.uploadImageFromLocal({
        pathimg: file.path,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
