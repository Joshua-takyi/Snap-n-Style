import { Cart, Product } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import { GetSession } from "@/utils/session/getSession";

export async function POST(req) {
	try {
		const { productId, quantity, color, model } = await req.json();

		// Validate input
		if (!productId || !quantity || quantity <= 0 || !model) {
			return NextResponse.json(
				{ message: "Invalid product details" },
				{ status: 400 }
			);
		}

		await ConnectDb();
		const session = await auth();

		if (!session?.user?.accessToken) {
			return NextResponse.json(
				{ message: "User not authenticated" },
				{ status: 401 }
			);
		}

		const userId = session?.user?.id;
		if (!userId) {
			return NextResponse.json(
				{ message: "Invalid user session" },
				{ status: 401 }
			);
		}

		// Check if the product exists and is available
		const product = await Product.findById(productId);
		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}
		if (!product.available || product.stock < quantity) {
			return NextResponse.json(
				{ message: "Product not available or insufficient stock" },
				{ status: 400 }
			);
		}

		// Find or create cart for user with proper error handling
		let cart;
		try {
			cart = await Cart.findOne({ userId: userId });

			if (!cart) {
				cart = await Cart.create({
					userId: userId,
					products: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.error("Error finding/creating cart:", error);
			return NextResponse.json(
				{ message: "Error managing cart" },
				{ status: 500 }
			);
		}

		// Validate cart structure
		if (!cart.products) {
			cart.products = [];
		}

		// Check if product already exists in cart
		const existingProductIndex = cart.products.findIndex(
			(item) =>
				item.productId?.toString() === productId &&
				item.color === color &&
				item.model === model
		);

		const calculatedPrice = product.price * (1 - (product.discount || 0) / 100);

		if (existingProductIndex > -1) {
			// Update existing product quantity
			cart.products[existingProductIndex].quantity += quantity;
			cart.products[existingProductIndex].totalPrice =
				calculatedPrice * cart.products[existingProductIndex].quantity;
		} else {
			// Add new product to cart
			cart.products.push({
				productId,
				quantity,
				color,
				model,
				totalPrice: calculatedPrice * quantity,
			});
		}

		cart.updatedAt = new Date();
		await cart.save();

		return NextResponse.json(
			{
				message: "Item added to cart successfully",
				data: cart,
				productDetails: {
					name: product.itemName,
					price: calculatedPrice,
					image: product.image[0],
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding item to cart:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
