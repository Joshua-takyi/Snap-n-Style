import { Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";

// Helper function to generate SKU
const generateSku = (brand, itemName, category) => {
	const brandCode = brand.slice(0, 3).toUpperCase(); // First 3 letters of brand
	const itemCode = itemName.slice(0, 3).toUpperCase(); // First 3 letters of item name
	const categoryCode = category.slice(0, 3).toUpperCase(); // First 3 letters of category
	return `${brandCode}-${itemCode}-${categoryCode}`; // Combine to create SKU
};

// Add a new product
export async function POST(req) {
	try {
		// Parse the request body
		const {
			itemName,
			description,
			image,
			price,
			category,
			stock,
			brand,
			discount,
			itemModel,
			details,
			tags,
			colors,
			materials,
			features,
			isOnSale,
		} = await req.json();

		// Validate required fields
		if (
			!brand ||
			!itemName ||
			!category ||
			!itemModel ||
			!details ||
			!tags ||
			!image ||
			!price ||
			!stock ||
			!colors ||
			!materials ||
			!features ||
			!isOnSale
		) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Generate SKU
		const sku = generateSku(brand, itemName, category);

		// Connect to the database
		await ConnectDb();

		// Create the new product
		const newItem = await Product.create({
			itemName,
			description,
			image,
			price,
			category,
			stock,
			brand,
			sku,
			discount,
			details,
			itemModel,
			tags,
			colors,
			materials,
			features,
			isOnSale,
		});

		// Log the new item for debugging
		logger.info("New Item Created:", newItem);

		// Return success response
		return NextResponse.json(
			{ message: "Item created successfully", data: newItem },
			{ status: 201 }
		);
	} catch (error) {
		// Log and handle errors
		logger.error("Error creating item:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Helper function to build query object
const buildQuery = (searchParams) => {
	const query = {};
	const category = searchParams.get("category");
	const price = searchParams.get("price");
	const rating = searchParams.get("rating");
	const isOnSale = searchParams.get("isOnSale");
	const itemModel = searchParams.get("itemModel");
	const brand = searchParams.get("brand");
	const search = searchParams.get("search");
	const model = searchParams.get("model");
	const tags = searchParams.get("tags");
	if (category) query.category = category;
	if (price) query.price = { $lte: Number(price) };
	if (rating) query.rating = { $gte: Number(rating) };
	if (isOnSale) query.isOnSale = isOnSale === "true";
	if (itemModel) query.itemModel = itemModel;
	if (brand) query.brand = brand;

	if (model) {
		try {
			const parsedModel = JSON.parse(model);
			if (Array.isArray(parsedModel) && parsedModel.length > 0) {
				query.itemModel = {
					$in: parsedModel.map(
						(m) => new RegExp(m.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i")
					),
				};
			}
		} catch (e) {
			logger.error("Error parsing model:", e);
		}
	}

	if (tags) {
		try {
			// Try parsing as JSON first
			const parsedTags = JSON.parse(tags);
			if (Array.isArray(parsedTags) && parsedTags.length > 0) {
				query.tags = {
					$in: parsedTags.map(
						(t) => new RegExp(t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i")
					),
				};
			}
		} catch (e) {
			// If JSON parsing fails, treat as a single tag string
			query.tags = new RegExp(
				tags.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
				"i"
			);
		}
	}

	if (search) {
		query.$or = [
			{ itemName: { $regex: search, $options: "i" } },
			{ category: { $regex: search, $options: "i" } },
			{ brand: { $regex: search, $options: "i" } },
			{ description: { $regex: search, $options: "i" } },
		];
	}

	return query;
};

// Helper function to build sort object
const buildSort = (sortBy, sortOrder) => {
	return sortBy
		? { [sortBy]: sortOrder === "desc" ? -1 : 1 }
		: { createdAt: -1 };
};

export async function GET(req) {
	try {
		await ConnectDb();
		const searchParams = req.nextUrl.searchParams;
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder") || "desc";
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const skip = (page - 1) * limit;
		const tags = searchParams.get("tags") || "";

		const query = buildQuery(searchParams);
		const sort = buildSort(sortBy, sortOrder);
		const tagsQuery = tags ? { tags: { $in: tags } } : {};
		const [items, totalItems] = await Promise.all([
			Product.find({ ...query, ...tagsQuery })
				.sort(sort)
				.skip(skip)
				.limit(limit),
			Product.countDocuments({ ...query, ...tagsQuery }),
		]);

		logger.info("Items Fetched:", items);

		return NextResponse.json({
			data: items,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalItems / limit),
				totalItems,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		logger.error("Error fetching items:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
