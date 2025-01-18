import { Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Establish DB connection
		await ConnectDb();

		// Fetch items from the database
		const data = await Product.find({ category: "phone-cases" })
			.sort({ createdAt: -1 })
			.limit(8);

		// Log success message
		logger.info(`Fetched ${data.length} items successfully`);

		// Return the data as a response
		return NextResponse.json({
			message: "Items fetched successfully",
			data,
		});
	} catch (error) {
		// Log the error
		logger.error("Error fetching items:", error);

		// Return error response
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
