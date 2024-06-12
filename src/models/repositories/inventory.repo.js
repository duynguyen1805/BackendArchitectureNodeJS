"use strict";
const { Types } = require("mongoose");
const inventorySchema = require("../../models/inventory.model");

const insert_Inventory = async ({
  product_id,
  shopId,
  stock,
  location = "unknow",
}) => {
  const result = await inventorySchema.create({
    inven_productId: product_id,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
  return result;
};

module.exports = { insert_Inventory };
