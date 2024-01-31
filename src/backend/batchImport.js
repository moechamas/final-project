const { MongoClient } = require('mongodb');
const { events, reservations } = require('../data.js');

const uri = "mongodb+srv://moechamas:fDrc4hrYcWW4iTeG@cluster0.ovqzwlc.mongodb.net/?retryWrites=true&w=majority";

async function batchImport() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("FinalProject");
    const eventsCollection = database.collection("events");
    const reservationsCollection = database.collection("reservations");

    // Insert events
    const eventsResult = await eventsCollection.insertMany(events);
    console.log(`${eventsResult.insertedCount} events documents were inserted`);

    // Insert reservations
    const reservationsResult = await reservationsCollection.insertMany(reservations);
    console.log(`${reservationsResult.insertedCount} reservations documents were inserted`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

batchImport();
