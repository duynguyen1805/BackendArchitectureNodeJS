const RedisPublishService = require("../services/redis.Publish.service");

class InventoryServiceTest_Subscribe {
  constructor() {
    RedisPublishService.subscribe("purchase_EVENTS", (channel, message) => {
      InventoryServiceTest_Subscribe.updateInventory(JSON.parse(message));
    });
  }

  static updateInventory({ productId, quantity }) {
    console.log(`update inventory: ${productId} with quantity: ${quantity}`);
  }
}

module.exports = new InventoryServiceTest_Subscribe();
