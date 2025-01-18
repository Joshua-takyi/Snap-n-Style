import { auth } from "@/libs/auth";
import { Cart } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";

// Remove item from cart
export async function DELETE(req) {
	try {
		const { productId, color, model } = await req.json();

		if (!productId) {
			return NextResponse.json(
				{ message: "Product ID is required" },
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

		const cart = await Cart.findOne({ userId: userId });
		if (!cart) {
			return NextResponse.json({ message: "Cart not found" }, { status: 404 });
		}

		const productIndex = cart.products.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				item.color === color &&
				item.model === model
		);

		if (productIndex === -1) {
			return NextResponse.json(
				{ message: "Product not found in cart" },
				{ status: 404 }
			);
		}

		cart.products.splice(productIndex, 1);
		await cart.save();

		return NextResponse.json(
			{ message: "Item removed from cart successfully", data: cart },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error removing item from cart:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
