"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Templates";
const document_name = "Template";

// Declare the Schema of the Mongo model
var templateSchema = new mongoose.Schema(
  {
    temp_id: {
      type: Number,
      required: true,
    },
    temp_name: {
      // unique
      type: String,
      required: true,
    },
    temp_status: {
      type: String,
      default: "active",
      enum: ["active", "block"],
    },
    temp_html: {
      type: String,
      required: true,
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, templateSchema);
