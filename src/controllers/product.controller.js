"use strict";

const ProductService_V2 = require("../services/product.service.v2");
const SuccessResponse = require("../core/success.response");
const { newSPU } = require("../services/spu.service");
const { getOneSKU } = require("../services/sku.service");

class ProductController {
  /* SPU SKU */

  createSPU = async (req, res, next) => {
    try {
      const spu = await newSPU({ ...req.body, product_shop: req.user.userId });

      new SuccessResponse.OK({
        message: "Create SPU Product successfully",
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findOneSKU = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;
      new SuccessResponse.OK({
        message: "Get one SKU successfully",
        metadata: await getOneSKU({ sku_id, product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /* -------------------------------END SPU SKU------------------------------- */

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

  findAll_PublishedProduct_ByShop = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list of published products successfully",
      metadata: await ProductService_V2.findAll_PublishedProduct_ByShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publish_Product_ByShop = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Publish product successfully",
      metadata: await ProductService_V2.publish_Product_ByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  unPublish_Product_ByShop = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Unpublish product successfully",
      metadata: await ProductService_V2.unPublish_Product_ByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  searchProducts_ByUser = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Search products successfully",
      metadata: await ProductService_V2.searchProducts_ByUser({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  findAll_Products = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get list of products successfully",
      metadata: await ProductService_V2.findAll_Products({
        limit: req.body.limit,
        sort: req.body.sort,
        page: req.body.page,
        filter: req.body.filter,
        select: req.body.select,
      }),
    }).send(res);
  };

  find_DetailProduct = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get detail product successfully",
      metadata: await ProductService_V2.find_DetailProduct({
        product_id: req.params.product_id,
        // unSelect: req.body.unSelect,
      }),
    }).send(res);
  };

  UpdateProduct = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Update product successfully",
      metadata: await ProductService_V2.UpdateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
