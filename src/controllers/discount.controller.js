"use strict";

const DiscountService = require("../services/discount.service");
const SuccessResponse = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Create discount successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscountCode = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Update discount successfully",
      metadata: await DiscountService.updateDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getProductsByDiscountCode = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list of products successfully",
      metadata: await DiscountService.getProductsByDiscountCode({
        userId: req.user ? userId : null,
        shopId: req.query.shopId,
        code: req.query.code,
        page: req.query.page,
        limit: req.query.limit,
      }),
    }).send(res);
  };

  getAllDiscountByShop = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list of discount By Shop successfully",
      metadata: await DiscountService.getAllDiscountByShop({
        shopId: req.user.userId,
        page: req.query.page,
        limit: req.query.limit,
        isActive: req.query.isActive,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get discount amount successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Delete discount successfully",
      metadata: await DiscountService.deleteDiscountCode({
        code: req.body.code,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Cancel discount successfully",
      metadata: await DiscountService.cancelDiscountCode({
        code: req.body.code,
        shopId: req.body.shopId,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
