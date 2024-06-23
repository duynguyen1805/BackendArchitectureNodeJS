"use strict";

const commentSchema = require("../models/comment.model");
const { convert_toObjectId_MongoDB } = require("../utils/index");
const errResponse = require("../core/error.response");

/*
    key feature: Comment Service - Nested Comments
    - add comment [user | shop]
    - get list of comment [user | shop]
    - delete comment [user | shop | admin]
*/

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    // new comment
    const comment = new commentSchema({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    // set RIGHT
    let rightValue;
    if (parentCommentId) {
      // reply comment - chèn 1 node vô >> tăng lên 2 (left,right)
      const parentComment = await commentSchema.findById(parentCommentId);
      if (!parentComment) {
        throw new errResponse.NotFoundError("ID Parent comment not exist");
      }
      rightValue = parentComment.comment_right;

      // updateMany Comment
      await commentSchema.updateMany(
        {
          comment_productId: convert_toObjectId_MongoDB(productId),
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );

      await commentSchema.updateMany(
        {
          comment_productId: convert_toObjectId_MongoDB(productId),
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      // find max rightValue
      const maxRightValue = await commentSchema.findOne(
        {
          comment_productId: convert_toObjectId_MongoDB(productId),
        },
        "comment_right",
        {
          sort: { comment_right: -1 },
        }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    return await comment.save();
  }

  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    skip = 0,
  }) {
    if (parentCommentId) {
      // get reply comment
      const parentComment = await commentSchema.findById(parentCommentId);

      if (!parentComment) {
        throw new errResponse.NotFoundError("ID Parent comment not exist");
      }

      // get comment > leftParent && < rightParent
      const comments = await commentSchema
        .find({
          comment_productId: convert_toObjectId_MongoDB(productId),
          comment_left: { $gt: parentComment.comment_left }, // > leftParent
          comment_right: { $lt: parentComment.comment_right }, // < rightParent
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await commentSchema
      .find({
        comment_productId: convert_toObjectId_MongoDB(productId),
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }
}

module.exports = CommentService;
