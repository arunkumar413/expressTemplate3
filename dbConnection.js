const { Pool, Client } = require("pg");
module.exports.knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "codeGround",
  },
});

module.exports.pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "codeGround",
  password: "postgres",
  port: 5432,
});
