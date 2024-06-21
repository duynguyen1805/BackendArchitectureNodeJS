"use strict";

const redis = require("redis");
const {
  REDIS_CONNECT_MESSAGE,
  REDIS_CONNECT_TIMEOUT,
} = require("../../constant");
const errResponse = require("../core/error.response");

const config_connect = {
  host: "localhost",
  port: 6379,
  password: "123456",
};

const client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    RECONNECT: "reconnecting",
    END: "end",
    ERROR: "error",
  },
  connectionTimeOut = null;

const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("connectionRedis - Connection Status: -----CONNECTED-----");
    // clear timeout
    clearTimeout(connectionTimeOut);
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("connectionRedis - Connection Status: RECONNECTING");
    // clear timeout
    clearTimeout(connectionTimeOut);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("connectionRedis - Connection Status: END");
    // retry connect
    handleTimeOutError();
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection Status: ERROR with ${err}`);
    // retry connect
    handleTimeOutError();
  });
};

const handleTimeOutError = () => {
  connectionTimeOut = setTimeout(() => {
    throw new errResponse.RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.vn,
      status: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleEventConnect({ connectionRedis: instanceRedis });
  //   console.log(instanceRedis);
};

const getRedis = () => client;

const closeRedis = () => {
  if (client.instanceConnect) {
    client.instanceConnect.quit();
  }
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
