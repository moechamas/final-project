const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; 
console.log("Connecting to MongoDB with URI:", uri); 

async function connectDB() {
  if (!uri) {
    throw new Error("MongoDB connection URI is not set in environment variables");
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db("FinalProject");
  return db;
}

module.exports = { connectDB };
