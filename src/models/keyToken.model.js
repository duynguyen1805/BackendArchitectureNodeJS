"use strict";

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "keysToken";
const document_name = "keyToken";

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // document_name
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, keyTokenSchema);
