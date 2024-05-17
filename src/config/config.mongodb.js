"use strict";

// LEVEL 0
// const config = {
//   app: {
//     port: 4000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "ecommerce",
//   },
// };
// module.exports = config;

// LEVEL 1
const development = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "ecommerce",
  },
};
const production = {
  app: {
    port: process.env.PRODUCT_APP_PORT || 4000,
  },
  db: {
    host: process.env.PRODUCT_DB_HOST || "localhost",
    port: process.env.PRODUCT_DB_PORT || 27017,
    name: process.env.PRODUCT_DB_NAME || "ecommerce_production",
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";
module.exports = config[env];
