const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DB_INSIDE,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

module.exports= client;
