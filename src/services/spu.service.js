"use strict";

const errResponse = require("../core/error.response");
const productSPUSchema = require("../models/spu.model");
const { findShopById } = require("../models/repositories/shop.repo");
const { customizeProductId } = require("../utils/index");

const { newSKU } = require("./sku.service");

const newSPU = async ({
  product_id,
  product_name,
  product_thumbnail,
  product_price,
  product_description,
  product_category,
  product_shop,
  product_quantity,
  product_attributes,
  product_variations,
  sku_list = [],
}) => {
  try {
    // check Shop exist
    const foundShop = await findShopById({ shopId: product_shop });
    if (!foundShop) {
      throw new errResponse.BadRequestError("Shop not exist");
    }

    // create new SPU
    const newSPU = await productSPUSchema.create({
      product_id: customizeProductId({ product_shop }),
      product_name,
      product_thumbnail,
      product_price,
      product_description,
      product_category,
      product_shop,
      product_quantity,
      product_attributes,
      product_variations,
      // sku_list,
    });

    if (newSPU && sku_list.length > 0) {
      // create SKUs
      await newSKU({ spu_id: newSPU.product_id, sku_list });
    }

    // --------async data via elasticsearch (search service)--------

    // response result object

    return !!newSPU;
  } catch (error) {
    throw new errResponse.BadRequestError(error);
  }
};

module.exports = { newSPU };
