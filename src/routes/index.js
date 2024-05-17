var express = require("express");
var router = express.Router();
const {
  check_apiKey,
  checkPermissions_apiKey,
} = require("../auth/checkAuth.js");

// // check apiKey
// router.use(check_apiKey);
// // check permission
// router.use(checkPermissions_apiKey("0000"));

router.use("/v1/api", require("./v1/access/index.js"));

module.exports = router;
