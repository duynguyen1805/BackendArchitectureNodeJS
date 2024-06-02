var express = require("express");
var router = express.Router();
const AccessController = require("../../../controllers/access.controller");
const { asyncHandler } = require("../../../auth/checkAuth");
// public routes
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/login", asyncHandler(AccessController.login));

module.exports = router;
