"use strict";
const mongoose = require("mongoose"); // Erase if already required
// var mongoose_delete = require("mongoose-delete");

// const slug = require("mongoose-slug-generator");
// mongoose.plugin(slug);

const collection_name = "Users";
const document_name = "User";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    phonenumber: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: Array,
      default: [],
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    collection: collection_name,
    timestamps: true,
  }
);

// userSchema.plugin(mongoose_delete);
// userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

//Export the model
// module.exports = mongoose.model("Users", userSchema, "Users");
module.exports = mongoose.model(document_name, userSchema);
