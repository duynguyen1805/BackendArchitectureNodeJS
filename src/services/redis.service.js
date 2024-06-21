"use strict";

const redis = require("redis");
// const redisClient = redis.createClient();
const { promisify } = require("util"); // => chuyển đổi hàm thành hàm asycn await promise

const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

// redisClient.ping((err, result) => {
//   if (err) {
//     console.error("ERROR connecting redis: ", err);
//   } else {
//     console.log("--------------CONNECTED to REDIS--------------");
//   }
// });

// CONNECT REDIS NEW

const { getRedis } = require("../db/init.redisdb");

const { instanceConnect: redisClient } = getRedis();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

/*
  giữ lại chỉ có 1 người thanh toán cùng lúc
    1. Tạo key
    2. Đặt hàng >>> check key >>> hoàn thành, cập nhật data (inventory, product, cart,...)
    3. Truyền key qua user tiếp theo
*/
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const retryTime = 10; // cho phép đợi, thử lại 10 lần
  const expireTime = 3000; // thời gian tạm lock

  for (let i = 0; i < retryTime; i++) {
    // tạo 1 key, user lần lượt sử dụng để vào thanh toán
    const result = await setnxAsync(key, expireTime);
    console.log("result createKey setnxAsync:: ", result); // có user đang giữ return 0, else return 1

    if (result === 1) {
      // thao tác inventory,... cập nhật data
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      // thử lại
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// giải phóng lock
const releaseLock = async (keyLock) => {
  const deleteAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await deleteAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
