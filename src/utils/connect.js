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
		const connection = await mongoose.connect(fullUri);
		logger.info("Connected to MongoDB");
		cachedConnection = connection;
		return connection;
	} catch (error) {
		logger.error("Failed to connect to MongoDB:", error);
		throw error;
	}
};

export default ConnectDb;
