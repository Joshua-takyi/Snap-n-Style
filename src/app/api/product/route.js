import { Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";

const validateItem = (item) => {
	if (typeof item !== "object") return false;
	if (typeof item.itemName !== "string") return false;
	if (typeof item.price !== "number") return false;
	if (typeof item.description !== "string") return false;
	if (!Array.isArray(item.image)) return false; // Fixed: image should be an array
	if (typeof item.discount !== "number") return false;
	if (typeof item.category !== "string") return false;
	if (typeof item.stock !== "number") return false;
	if (typeof item.isFeatured !== "boolean") return false;
	if (typeof item.brand !== "string") return false;
	if (!Array.isArray(item.tags)) return false;
	if (!Array.isArray(item.variants)) return false;
	if (typeof item.rating !== "number") return false;
	if (typeof item.available !== "boolean") return false;
	return true;
};

const generateSku = (brand, itemName, category) => {
	const brandCode = brand.slice(0, 3).toUpperCase();
	const itemCode = itemName.slice(0, 3).toUpperCase();
	const categoryCode = category.slice(0, 3).toUpperCase();
	const sku = `${brandCode}-${itemCode}-${categoryCode}`;
	return sku;
};

// add product
export async function POST(req) {
	try {
		const reqBody = await req.json();

		const requiredFields = [
			"itemName",
			"price",
			"description",
			"image",
			"discount",
			"category",
			"stock",
			"isFeatured",
			"brand",
			"tags",
			"variants",
			"rating",
			"available",
		];

		for (const field of requiredFields) {
			if (!reqBody[field]) {
				return NextResponse.json(
					{ message: `${field} is required` },
					{ status: 400 }
				);
			}
		}

		if (!validateItem(reqBody)) {
			return NextResponse.json(
				{ message: "Invalid item data" },
				{ status: 400 }
			);
		}

		// Generate SKU
		const sku = generateSku(reqBody.brand, reqBody.itemName, reqBody.category);

		await ConnectDb();

		// Create the new item
		const newItem = await Product.create({
			itemName: reqBody.itemName,
			description: reqBody.description,
			image: reqBody.image,
			price: reqBody.price,
			rating: reqBody.rating,
			discount: reqBody.discount,
			category: reqBody.category,
			stock: reqBody.stock,
			isFeatured: reqBody.isFeatured,
			brand: reqBody.brand,
			available: reqBody.available,
			tags: reqBody.tags,
			variants: reqBody.variants,
			sku: sku,
		});
		console.log("New Item:", newItem); // Debugging line

		return NextResponse.json(
			{ message: "Item created successfully", data: newItem },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating item:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		await ConnectDb();
		const items = await Product.find();
		return NextResponse.json({
			message: "items fetched successfully",
			data: items,
		});
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
