const { MongoClient } = require("mongodb");

let clientPromise;

async function getTasksCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  const db = process.env.MONGODB_DB || "task_manager";
  return client.db(db).collection("tasks");
}

module.exports = { getTasksCollection };
