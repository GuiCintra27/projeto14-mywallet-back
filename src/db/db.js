
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
}catch(err){
    console.log(err);
}

const db = mongoClient.db("my-wallet-db");
export const users = db.collection("users");
export const sessions = db.collection("sessions");