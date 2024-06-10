"use strict";

const ProductService = require("../services/product.service");
const SuccessResponse = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body;
    new SuccessResponse.OK({
      message: "Create product successfully",
      metadata: await ProductService.CreateProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
