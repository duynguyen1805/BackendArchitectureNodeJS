var express = require("express");
var router = express.Router();
const ProductController = require("../../../controllers/product.controller");
const DiscountController = require("../../../controllers/discount.controller");
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
router.post("/find_all", asyncHandler(ProductController.findAll_Products));
router.get("/:product_id", asyncHandler(ProductController.find_DetailProduct));

router.get(
  "/discount",
  asyncHandler(DiscountController.getProductsByDiscountCode)
);

// authentication
router.use(authentication_Ver2);

// route need authentication
router.post("/create", asyncHandler(ProductController.createProduct));
router.patch("/:product_id", asyncHandler(ProductController.UpdateProduct));

router.post(
  "/discount/create",
  asyncHandler(DiscountController.createDiscountCode)
);
router.patch(
  "/discount/update",
  asyncHandler(DiscountController.updateDiscountCode)
);
router.get(
  "/discount-by-shop",
  asyncHandler(DiscountController.getAllDiscountByShop)
);

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
