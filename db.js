const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://sxvrsafzpkrfqh:7a0f0c61127a0096a017939504d84c2be34b5b2119cc726671ec237de1597127@ec2-52-71-153-228.compute-1.amazonaws.com:5432/dcnv7980km3uv0",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

module.exports= client;
