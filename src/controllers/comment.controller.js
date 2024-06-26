"use strict";

const CommentService = require("../services/comment.service");
const SuccessResponse = require("../core/success.response");

class CommentController {
  // create comment
  createComment = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Create new comment successfully",
      metadata: await CommentService.createComment({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get comment successfully",
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Delete comment successfully",
      metadata: await CommentService.deleteComments(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
