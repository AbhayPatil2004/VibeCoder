// lib/db.js
import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

// global variable to avoid creating multiple connections in dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // recommended for Next.js
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
