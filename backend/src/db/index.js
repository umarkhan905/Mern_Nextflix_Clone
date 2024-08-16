import mongoose from "mongoose";
import { ENV_VARS } from "../config/envVars.config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error while connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
