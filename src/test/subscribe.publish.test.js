const RedisPublishService = require("../services/redis.Publish.service");

class ProductServiceTest {
  purchaseProduct({ productId, quantity }) {
    const order = {
      productId,
      quantity,
    };

    RedisPublishService.publish("purchase_EVENTS", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
