const { Client } = require('pg');

const databaseURL = process.env.DATABASE_URL || 'postgresql://mimicopus:mimicopus@127.0.0.1:5432/mimicopus';

const client = new Client({
  connectionString: databaseURL,
});
client.connect();

module.exports = client;
