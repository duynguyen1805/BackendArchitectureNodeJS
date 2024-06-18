"use strict";

const inventorySchema = require("../models/inventory.model");
const { findProduct_ById } = require("../models/repositories/product.repo");
const errResponse = require("../core/error.response");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "unknow",
  }) {
    const product = await findProduct_ById({ productId });
    if (!product) {
      throw new errResponse.NotFoundError("Product not exist");
    }

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      option = {
        upsert: true,
        new: true,
      };

    return await inventorySchema.findOne(query, updateSet, option);
  }
}

module.exports = InventoryService;
