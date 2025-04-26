import { MongoClient } from "mongodb";

// Safe TypeScript for global
declare global {
  // Allow global `_mongoClientPromise` to avoid 'any'
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI!;
const options = {};

if (!uri) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In dev, use a global variable to preserve MongoClient across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new MongoClient
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
