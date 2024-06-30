"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "OTPs";
const document_name = "OTP";

// Declare the Schema of the Mongo model
var otpSchema = new mongoose.Schema(
  {
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: { type: Date, default: Date.now, index: { expires: 60 } },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, otpSchema);
