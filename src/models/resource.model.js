"use strict";
const mongoose = require("mongoose"); // Erase if already required
// var mongoose_delete = require("mongoose-delete");

// const slug = require("mongoose-slug-generator");
// mongoose.plugin(slug);

const collection_name = "Resources";
const document_name = "Resource";

// Declare the Schema of the Mongo model
var resourceSchema = new mongoose.Schema(
  {
    src_name: {
      type: String,
      required: true,
    },
    src_slug: {
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      required: true,
      default: "",
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
module.exports = mongoose.model(document_name, resourceSchema);
