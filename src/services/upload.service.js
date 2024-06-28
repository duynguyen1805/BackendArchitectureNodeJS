"use strict";

const cloudinary = require("../config/config.cloudinary");

// 1. upload from url image
const uploadImageFromUrl = async (
  url = "https://firebasestorage.googleapis.com/v0/b/sendotp-ff6eb.appspot.com/o/images_sp_tindang%2F1701444207387.png?alt=media&token=6232dc70-c111-4e38-9f71-8732d5327c31"
) => {
  try {
    const urlImage = url;
    const folderName_cloudinary = "products/shopId",
      newFileName = "testDemo";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName_cloudinary,
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  uploadImageFromUrl,
};
