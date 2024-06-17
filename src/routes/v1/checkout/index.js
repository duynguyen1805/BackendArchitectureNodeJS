var express = require("express");
var router = express.Router();
const CheckoutController = require("../../../controllers/checkout.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// ----------------------------authentication----------------------------
router.use(authentication_Ver2);

router.post("/get-review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
