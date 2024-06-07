var express = require("express");
var router = express.Router();
const ProductController = require("../../../controllers/product.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// authentication
router.use(authentication);

// route need authentication
router.post("/create", asyncHandler(ProductController.createProduct));

module.exports = router;
