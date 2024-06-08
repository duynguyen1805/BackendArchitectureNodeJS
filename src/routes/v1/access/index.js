var express = require("express");
var router = express.Router();
const AccessController = require("../../../controllers/access.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const {
  authentication,
  authentication_Ver2,
} = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
//   REFRESHTOKEN: "refreshtoken",
// };

// public routes
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/login", asyncHandler(AccessController.login));

// authentication
router.use(authentication_Ver2);

// route need authentication
router.get("/logout", asyncHandler(AccessController.logout));
router.post(
  "/handlerRefreshToken",
  asyncHandler(AccessController.handlerRefreshToken)
);

module.exports = router;
