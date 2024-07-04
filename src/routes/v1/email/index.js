var express = require("express");
var router = express.Router();
const EmailController = require("../../../controllers/email.controller");
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

router.post("/create-template", asyncHandler(EmailController.newTemplate));
router.get("/verify", asyncHandler(AccessController.checkRegisterEmailToken));

// authentication
router.use(authentication_Ver2);

module.exports = router;
