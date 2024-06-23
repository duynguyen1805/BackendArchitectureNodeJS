"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Notifications";
const document_name = "Notification";

/*
    ORDER-SUSSCESS: dat hang thanh cong
    ORDER-FAIL: dat hang that bai
    ORDER-PENDING: dat hang dang cho
    PROMOTIONS-NEW: khuyen mai moi
    PROMOTIONS-EXPIRED: khuyen mai het hieu luc
    SHOP-NEW-PRODUCT: shop moi ra san pham moi
    ....
*/

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: [
        "ORDER-SUSSCESS",
        "ORDER-FAIL",
        "ORDER-PENDING",
        "PROMOTIONS-NEW",
        "PROMOTIONS-EXPIRED",
        "SHOP-NEW-PRODUCT",
      ],
      required: true,
    },
    noti_senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    noti_receiverId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, notificationSchema);
