import { Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";

// Cache for frequently accessed data (optional, can use Redis for production)
const cache = new Map();

// Helper function to validate ID
const isValidId = (id) => {
	return /^[0-9a-fA-F]{24}$/.test(id); // MongoDB ObjectId is 24 characters long
};

// Update product by ID
export async function PUT(req, { params }) {
	try {
		const { id } = params;

		// Validate ID
		if (!isValidId(id)) {
			return NextResponse.json(
				{ message: "Invalid product ID" },
				{ status: 400 }
			);
		}

		const reqBody = await req.json();

		// Validate request body
		if (!reqBody || Object.keys(reqBody).length === 0) {
			return NextResponse.json(
				{ message: "Request body is required" },
				{ status: 400 }
			);
		}

		await ConnectDb();

		// Update the product
		const updatedItem = await Product.findByIdAndUpdate(
			id,
			{ $set: reqBody },
			{ new: true, runValidators: true }
		);

		if (!updatedItem) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Invalidate cache for this product
		cache.delete(id);

		return NextResponse.json(
			{ message: "Product updated successfully", data: updatedItem },
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error updating product:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Delete product by ID
export async function DELETE(req, { params }) {
	try {
		const { id } = params;

		// Validate ID
		if (!isValidId(id)) {
			return NextResponse.json(
				{ message: "Invalid product ID" },
				{ status: 400 }
			);
		}

		await ConnectDb();

		// Delete the product
		const deletedItem = await Product.findByIdAndDelete(id);

		if (!deletedItem) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Invalidate cache for this product
		cache.delete(id);

		return NextResponse.json(
			{ message: "Product deleted successfully", id: deletedItem.id },
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error deleting product:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Get product by ID
export async function GET(req, { params }) {
	try {
		const { id } = await params;

		// Validate ID
		if (!isValidId(id)) {
			return NextResponse.json(
				{ message: "Invalid product ID" },
				{ status: 400 }
			);
		}

		// Check cache for the product
		if (cache.has(id)) {
			logger.info("Product fetched from cache:", id);
			return NextResponse.json({ data: cache.get(id) });
		}

		await ConnectDb();

		// Fetch the product from the database
		const product = await Product.findById(id);

		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Cache the product for future requests
		cache.set(id, product);
		return NextResponse.json({ data: product });
	} catch (error) {
		logger.error("Error fetching product:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
