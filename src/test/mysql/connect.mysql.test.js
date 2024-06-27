"use strict";

const mysql = require("mysql2");

// create connection to pool server
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8811,
  password: "mysql8",
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// perform a sample operation
pool.query("SELECT 1 + 1 AS solution", function (err, result) {
  if (err) throw err;

  console.log("query success: ", result);

  // close pool connection
  pool.end((err) => {
    if (err) throw err;

    console.log("The connection pool is closed.");
  });
});
