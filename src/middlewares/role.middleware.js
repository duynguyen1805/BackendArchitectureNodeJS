const AccessControl = require("accesscontrol");

// let grantList_Example = [
//   {
//     role: "ADMIN",
//     resource: "profile",
//     action: "read:any",
//     attributes: "*, !totalPrice.example",
//   },
//   {
//     role: "ADMIN",
//     resource: "profile",
//     action: "create:any",
//     attributes: "*, !totalPrice.example",
//   },
//   {
//     role: "ADMIN",
//     resource: "profile",
//     action: "update:any",
//     attributes: "*, !totalPrice.example",
//   },
//   {
//     role: "ADMIN",
//     resource: "profile",
//     action: "delete:any",
//     attributes: "*, !totalPrice.example",
//   },

//   { role: "SHOP", resource: "profile", action: "read:own", attributes: "*" },
// ];
module.exports = new AccessControl();
