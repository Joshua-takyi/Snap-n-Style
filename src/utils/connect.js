import mongoose from "mongoose";
import logger from "./logger";

let cachedConnection = null;

const ConnectDb = async () => {
	if (cachedConnection) {
		// Reuse existing connection if available
		return cachedConnection;
	}

	const fullUri = process.env.MONGODB_URI;

	try {
		const connection = await mongoose.connect(fullUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			maxPoolSize: 10, // Use a connection pool of 10 connections
			serverSelectionTimeoutMS: 5000, // Faster failover if the server is unavailable
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		});

		logger.info("Connected to MongoDB");
		cachedConnection = connection; // Cache the connection
		return connection;
	} catch (error) {
		logger.error("Failed to connect to MongoDB:", error);
		throw error;
	}
};

export default ConnectDb;
