const { MongoClient } = require('mongodb');
const { events, reservations, pastEvents, reviews } = require('../data.js');

const uri = "mongodb+srv://moechamas:momo@cluster0.ovqzwlc.mongodb.net/?retryWrites=true&w=majority";

async function batchImport() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("FinalProject");
    const eventsCollection = database.collection("events");
    const reservationsCollection = database.collection("reservations");
    const pastEventsCollection = database.collection("pastEvents");
    const reviewsCollection = database.collection("reviews");

    const eventsResult = await eventsCollection.insertMany(events);
    console.log(`${eventsResult.insertedCount} events documents were inserted`);

    const reservationsResult = await reservationsCollection.insertMany(reservations);
    console.log(`${reservationsResult.insertedCount} reservations documents were inserted`);

    const pastEventsResult = await pastEventsCollection.insertMany(pastEvents);
    console.log(`${pastEventsResult.insertedCount} past events documents were inserted`);

    // Insert reviews
    const reviewsResult = await reviewsCollection.insertMany(reviews);
    console.log(`${reviewsResult.insertedCount} reviews documents were inserted`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

batchImport();
