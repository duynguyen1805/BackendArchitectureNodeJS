const redis = require("redis");

class RedisPublishService {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscriberchannel, message) => {
      if (channel === subscriberchannel) callback(channel, message);
    });
  }
}

module.exports = new RedisPublishService();
