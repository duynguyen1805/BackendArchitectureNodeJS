"use strict";

const errResponse = require("../core/error.response");
const skuSchema = require("../models/sku.model");
const { ramdomID } = require("../utils/index");

const newSKU = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${ramdomID({ value_attach: spu_id })}`,
      };
    });

    const newSKUs = await skuSchema.create(convert_sku_list);
    if (!newSKUs)
      throw new errResponse.BadRequestError(
        "func new SKU",
        "new SKUs not found"
      );

    return newSKUs;
  } catch (error) {
    throw new errResponse.BadRequestError("func new SKU", error);
  }
};

const getOneSKU = async ({ sku_id, product_id }) => {
  try {
    // read cached ...

    const sku = await skuSchema.findOne({ sku_id, product_id });

    if (sku) {
      // set cache ...
    }

    return sku;
  } catch (error) {
    throw new errResponse.BadRequestError("func getOneSKU error", error);
  }
};

module.exports = {
  newSKU,
  getOneSKU,
};
