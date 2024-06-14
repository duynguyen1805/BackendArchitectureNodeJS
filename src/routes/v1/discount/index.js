var express = require("express");
var router = express.Router();
const DiscountController = require("../../../controllers/discount.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// router public
router.get(
  "/list-products",
  asyncHandler(DiscountController.getProductsByDiscountCode)
);

// ----------------------------authentication----------------------------
router.use(authentication_Ver2);

router.post("/create", asyncHandler(DiscountController.createDiscountCode));
router.patch("/update", asyncHandler(DiscountController.updateDiscountCode));
router.get(
  "/get-discount-by-shop",
  asyncHandler(DiscountController.getAllDiscountByShop)
);
router.post(
  "/get-discount-amount",
  asyncHandler(DiscountController.getDiscountAmount)
);
router.delete(
  "/delete-discount-code",
  asyncHandler(DiscountController.deleteDiscountCode)
);
router.patch(
  "/cancel-discount-code",
  asyncHandler(DiscountController.cancelDiscountCode)
);

module.exports = router;
