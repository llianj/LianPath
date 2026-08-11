//centralizar a conexão com o bdd

const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db();
  console.log("Conectado ao MongoDB Atlas - database:", db.databaseName);
  return db;
}

module.exports = { connectDB };