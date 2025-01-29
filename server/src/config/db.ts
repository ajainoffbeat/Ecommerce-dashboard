import mongoose from "mongoose";
require("dotenv").config();

let connection: any = null;

const connectToDatabase = async () => {
  if (connection) {
    // If a connection already exists, return it
    return connection;
  }

  try {
    // Establish a new connection
    const dbURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
    connection = await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error(
      "Database not connected yet. Please call connectToDatabase first."
    );
  }
  return connection;
};

export { connectToDatabase, getConnection };
