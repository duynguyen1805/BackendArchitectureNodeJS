"use strict";
const { Types } = require("mongoose");
const inventorySchema = require("../../models/inventory.model");
const { convert_toObjectId_MongoDB } = require("../../utils");

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

// TRU so luong stock trong kho
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convert_toObjectId_MongoDB(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createdOn: new Date(),
        },
      },
    },
    option = {
      upsert: true,
      new: true,
    };

  return await inventorySchema.updateOne(query, updateSet, option);
};

module.exports = { insert_Inventory, reservationInventory };
