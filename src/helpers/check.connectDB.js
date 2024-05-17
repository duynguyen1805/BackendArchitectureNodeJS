"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log("number of connections: ", numConnection);
};

// check overload connect
const checkOverloadConnect = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;

    console.log("Active connection: ", numConnection);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);

    if (numConnection > maxConnections) {
      // hạn chế check tối đa, chừa để xử lý kịp thời
      console.log("Connection overload detected !!!");
      // notify.send("noti to team")
    }
  }, _SECONDS); // monitor every 5s
};

module.exports = {
  countConnect,
  checkOverloadConnect,
};
