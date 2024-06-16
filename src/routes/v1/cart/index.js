var express = require("express");
var router = express.Router();
const CartController = require("../../../controllers/cart.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// ----------------------------authentication----------------------------
router.use(authentication_Ver2);

router.post("/add", asyncHandler(CartController.addProductToCart));
router.post("/update", asyncHandler(CartController.updateCart));
router.delete("/delete", asyncHandler(CartController.deleteProduct_InCart));
router.get("/get", asyncHandler(CartController.getListUserCart));

module.exports = router;
