"use strict";

const CheckoutService = require("../services/checkout.service");
const SuccessResponse = require("../core/success.response");

class CheckoutController {
  // create cart
  checkoutReview = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Checkout Review successfully",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
