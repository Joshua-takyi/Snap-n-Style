import { Cart, Product} from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Update cart item quantity
export async function PUT(req) {
	try {
		const { productId, quantity, color, model } = await req.json();

		if (!productId || !quantity || quantity < 0) {
			return NextResponse.json(
				{ message: "Invalid update details" },
				{ status: 400 }
			);
		}

		await ConnectDb;

		const userId = cookies().get("userId")?.value;
		if (!userId) {
			return NextResponse.json(
				{ message: "User not authenticated" },
				{ status: 401 }
			);
		}

		const cart = await Cart.findOne({ user: userId });
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

		if (quantity === 0) {
			// Remove the product if quantity is 0
			cart.products.splice(productIndex, 1);
		} else {
			// Update quantity and total price
			const product = await Product.findById(productId);
			cart.products[productIndex].quantity = quantity;
			cart.products[productIndex].totalPrice = product.price * quantity;
		}

		await cart.save();

		return NextResponse.json(
			{ message: "Cart updated successfully", data: cart },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating cart:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

