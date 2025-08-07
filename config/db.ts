import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI as string;

const ConnectDB = async () => {
  mongoose.set("runValidators", true);
  mongoose.set("bufferCommands", true);

  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB is already connected.");
    return;
  }

  if (!mongoUri) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
    });

    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection", error);
    throw new Error("Failed to connect to MongoDB");
  }

  if (!mongoose.connection.listeners("disconnected").length) {
    mongoose.connection.on("disconnected", async () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
      setTimeout(ConnectDB, 5000);
    });
  }

  if (!mongoose.connection.listeners("reconnected").length) {
    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected.");
    });
  }

  if (!mongoose.connection.listeners("error").length) {
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err);
    });
  }
};

export default ConnectDB;
