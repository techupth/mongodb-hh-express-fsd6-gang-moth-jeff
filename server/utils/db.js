// Set up db connection here
import "dotenv/config";
import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URL;

export const client = new MongoClient(connectionString);

export const db = client.db("practice-mongo");
