var express = require("express");
var router = express.Router();
const {
  check_apiKey,
  checkPermissions_apiKey,
} = require("../auth/checkAuth_apiKey.js");

// // check apiKey
// router.use(check_apiKey);
// // check permission
// router.use(checkPermissions_apiKey("0000"));

router.use("/v1/api/checkout", require("./v1/checkout/index.js"));
router.use("/v1/api/discount", require("./v1/discount/index.js"));
router.use("/v1/api/inventory", require("./v1/inventory/index.js"));
router.use("/v1/api/cart", require("./v1/cart/index.js"));
router.use("/v1/api/product", require("./v1/product/index.js"));
router.use("/v1/api", require("./v1/access/index.js"));

module.exports = router;
