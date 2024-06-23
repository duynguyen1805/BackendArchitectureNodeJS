var express = require("express");
var router = express.Router();
const CommentController = require("../../../controllers/comment.controller");
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");

// type HEADER = {
//   API_KEY: "x-api-key",
//   CLIENT_ID: "x-client-id", => userId
//   AUTHORIZATION: "authorization", => accessToken
//   REFRESHTOKEN: "refreshtoken",
// };

// authentication
router.use(authentication_Ver2);

router.post("/create", asyncHandler(CommentController.createComment));
router.get(
  "/get-list-comment",
  asyncHandler(CommentController.getCommentByParentId)
);
router.delete("/delete", asyncHandler(CommentController.deleteComment));

module.exports = router;
