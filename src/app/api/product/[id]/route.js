import { Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";

// update product by id
export async function PUT(req, { params }) {
	try {
		const { id } = params;
		const reqBody = await req.json();

		if (!reqBody || Object.keys(reqBody).length === 0) {
			return NextResponse.json(
				{ message: "Request body is required" },
				{ status: 400 }
			);
		}

		await ConnectDb();

		if (!id) {
			console.log("Product not found with ID:", id);
			return NextResponse.json(
				{
					message: "invalid id",
				},
				{
					status: 404,
				}
			);
		}
		const updatedItem = await Product.findByIdAndUpdate(
			id,
			{
				$set: reqBody,
			},
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedItem) {
			return NextResponse.json({ message: "Item not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Item updated successfully", data: updatedItem },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating item:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// delete product by id
export async function DELETE(req, { params }) {
	const { id } = params;
	try {
		await ConnectDb();

		const deletedItem = await Product.findByIdAndDelete(id);

		if (!deletedItem) {
			return NextResponse.json(
				{
					message: "item not found",
				},
				{
					status: 404,
				}
			);
		}
		return NextResponse.json(
			{
				message: "item deleted successfully",
				id: deletedItem.id,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting item:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// get product by id
export async function GET(req, { params }) {
	const { id } = params;
	try {
		await ConnectDb();
		const item = await Product.findById(id);
		if (!item) {
			return NextResponse.json(
				{
					message: "item not found",
				},
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{
				message: "item fetched successfully",
				data: item,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching item:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
