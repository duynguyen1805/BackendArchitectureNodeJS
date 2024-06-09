var express = require("express");
var router = express.Router();
const ProductController = require("../../../controllers/product.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const {
  authentication,
  authentication_Ver2,
} = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// router public
router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.searchProducts_ByUser)
);

// authentication
router.use(authentication_Ver2);

// route need authentication
router.post("/create", asyncHandler(ProductController.createProduct));

// QUERY
router.get(
  "/drafts/all",
  asyncHandler(ProductController.findAll_DraftsProduct_ByShop)
);
router.get(
  "/published/all",
  asyncHandler(ProductController.findAll_PublishedProduct_ByShop)
);

// PUT
router.put(
  "/publish/:product_id",
  asyncHandler(ProductController.publish_Product_ByShop)
);
router.put(
  "/unpublish/:product_id",
  asyncHandler(ProductController.unPublish_Product_ByShop)
);

module.exports = router;
