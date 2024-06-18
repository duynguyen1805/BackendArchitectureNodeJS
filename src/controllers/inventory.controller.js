"use strict";

const InventoryService = require("../services/inventory.service");
const SuccessResponse = require("../core/success.response");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Add stock to inventory successfully",
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
