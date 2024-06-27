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

const batchSize = 10; // adjust batch size
const totalSize = 100; // adjust total size

let currentId = 1;

console.time("::::::::::::::::TIMER:::");
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;

    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("::::::::::::::::TIMER:::");
    pool.end((err) => {
      if (err) {
        console.log("error occurred while running batch");
      } else {
        console.log("Connection pool closed successfully");
      }
    });
    return;
  }

  const sql = "INSERT INTO Users (id, name, age, address) VALUES ?";
  pool.query(sql, [values], async function (err, result) {
    if (err) throw err;

    console.log(`Inserted: ${result.affectedRows} records`);

    await insertBatch();
  });
};
