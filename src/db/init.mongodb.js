"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../config/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

/** ---------------- cách cũ -------------- */
// mongoose
//   .connect(connectString)
//   .then((_) => console.log(`Connected MongoDB Success .!`))
//   .catch((err) => console.log(`Error connection DB`));

// dev
// if (1 === 1) {
//   mongoose.set("debug", true);
//   mongoose.set("debug", { color: true });
// }
// module.exports = mongoose;

/** ---------------- cách mới -------------- */
/** ---------Chỉ khởi tạo 1 kết nối--------- */
class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = "mongodb") {
    // development => log requests
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }

    mongoose
      .connect(connectString, { maxPoolSize: 100 }) // default pool size is 100
      .then((_) => console.log(`Connected MongoDB Success .!`, connectString))
      .catch((err) => console.log(`Error connection DB: `, err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
