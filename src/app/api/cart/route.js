import { Cart, Product, User } from "@/model/schema";
import { cookies } from "next/headers";
import { ConnectDb } from "@/utils/connect";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { productId, quantity } = await req.json();

		// Validate input
		if (!productId || !quantity || quantity <= 0) {
			return NextResponse.json(
				{ message: "Invalid product ID or quantity" },
				{ status: 400 }
			);
		}

		await ConnectDb(); // Connect to the database

		// Get user ID from cookies
		const userId = cookies().get("userId")?.value;
		if (!userId) {
			return NextResponse.json(
				{ message: "User not authenticated" },
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

		// Check if the product is already in the user's cart
		let cartItem = await Cart.findOne({ user: userId, product: productId });

		if (cartItem) {
			// Update quantity and total price if the item already exists in the cart
			cartItem.quantity += quantity;
			cartItem.totalPrice = product.price * cartItem.quantity;
			await cartItem.save();
		} else {
			// Create a new cart item if it doesn't exist
			cartItem = await Cart.create({
				user: userId,
				product: productId,
				quantity: quantity,
				totalPrice: product.price * quantity,
			});
		}

		// Update product stock (optional, depending on your business logic)
		product.stock -= quantity;
		await product.save();

		// Return success response
		return NextResponse.json(
			{ message: "Item added to cart successfully", data: cartItem },
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
