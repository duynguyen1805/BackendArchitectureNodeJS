"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Comments";
const document_name = "Comment";

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment_content: {
      type: String,
      default: "Context default",
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: document_name,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(document_name, commentSchema);
