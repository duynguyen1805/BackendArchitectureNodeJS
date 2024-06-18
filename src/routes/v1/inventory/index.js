var express = require("express");
var router = express.Router();
const InventoryController = require("../../../controllers/inventory.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// ----------------------------authentication----------------------------
router.use(authentication_Ver2);

router.post(
  "/add-stock",
  asyncHandler(InventoryController.addStockToInventory)
);

module.exports = router;
