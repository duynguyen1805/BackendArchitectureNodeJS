"use strict";
const mongoose = require("mongoose"); // Erase if already required
// var mongoose_delete = require("mongoose-delete");

// const slug = require("mongoose-slug-generator");
// mongoose.plugin(slug);

const collection_name = "Roles";
const document_name = "Role";

// const grantList = [
//     { role: "ADMIN", resource: "Profile", action: "update:any", attributes: "*" },
//     { role: "ADMIN", resource: "Balance", action: "update:any", attributes: "*, !mount" },

//     { role: "SHOP", resource: "Profile", action: "update:own", attributes: "*" },
//     { role: "SHOP", resource: "Balance", action: "update:own", attributes: "*, !mount" },

//     { role: "USER", resource: "Profile", action: "update:own", attributes: "*" },
//     { role: "USER", resource: "Profile", action: "read, write, ....:own", attributes: "*" },
// ]

// Declare the Schema of the Mongo model
var roleSchema = new mongoose.Schema(
  {
    rol_name: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "SHOP"],
    },
    rol_slug: {
      type: String,
      require: true,
    },
    rol_status: {
      type: String,
      enum: ["active", "inactive", "block"],
      default: "active",
    },
    rol_description: {
      type: String,
      default: "",
    },
    rol_grants: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
          require: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "*" },
      },
    ],
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
module.exports = mongoose.model(document_name, roleSchema);
