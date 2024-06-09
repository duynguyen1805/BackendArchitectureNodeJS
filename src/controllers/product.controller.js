"use strict";

const ProductService = require("../services/product.service");
const ProductService_V2 = require("../services/product.service.v2");
const SuccessResponse = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body;

    // Version 1
    // new SuccessResponse.OK({
    //   message: "Create product successfully",
    //   metadata: await ProductService.CreateProduct(product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    // Version 2
    new SuccessResponse.OK({
      message: "Create product successfully",
      metadata: await ProductService_V2.CreateProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   *
   * @param {Number} limit = 50
   * @param {Number} skip = 0
   * @param {String} product_shop
   */
  findAll_DraftsProduct_ByShop = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list of draft products successfully",
      metadata: await ProductService_V2.findAll_DraftsProduct_ByShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
