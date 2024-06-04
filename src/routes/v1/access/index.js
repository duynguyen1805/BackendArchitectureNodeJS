var express = require("express");
var router = express.Router();
const AccessController = require("../../../controllers/access.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
// };

// public routes
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/login", asyncHandler(AccessController.login));

// authentication
router.use(authentication);

// route need authentication
router.get("/logout", asyncHandler(AccessController.logout));

module.exports = router;
