"use strict";

const CartService = require("../services/cart.service");
const SuccessResponse = require("../core/success.response");

class CartController {
  // create cart
  addProductToCart = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Add product to cart successfully",
      metadata: await CartService.addProductToCart({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  // update + -
  updateCart = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Add product to cart successfully",
      metadata: await CartService.addProductToCart_v2({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  deleteProduct_InCart = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Delete product in cart successfully",
      metadata: await CartService.deleteProduct_InCart({
        userId: req.user.userId,
        productId: req.body.productId,
      }),
    }).send(res);
  };

  getListUserCart = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list user cart successfully",
      metadata: await CartService.getListUserCart({
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
