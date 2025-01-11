import mongoose from "mongoose";

const ConnectDb = async () => {
	const uri = process.env.MONGODB_URI;
	const pass = process.env.MONGODB_PASS;
	const fullUri = uri.replace("<db_password>", pass);
	try {
		await mongoose.connect(fullUri);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}
};

export default ConnectDb;
