import { Cart, User } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";
import { GetSession } from "@/utils/session/getSession";

// Get cart items for a user
export async function GET() {
	try {
		// Connect to the database
		await ConnectDb();

		// Retrieve the session for the authenticated user
		const session = await GetSession();
		const userId = session?.user?.id;

		// Check if the user is authenticated
		if (!userId) {
			return NextResponse.json(
				{ message: "User not authenticated" },
				{ status: 401 }
			);
		}

		// Check if the user exists in the database
		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		// Find the cart associated with the user
		const cart = await Cart.findOne({ userId: userId }).populate(
			"products.productId" // Populate product details
		);

		// If no cart exists for the user, return a response indicating so
		if (!cart) {
			return NextResponse.json(
				{ message: "No cart available for this user", data: [] },
				{ status: 200 }
			);
		}

		// Return the cart data for the user
		return NextResponse.json(
			{
				message: "Cart retrieved successfully",
				data: cart,
			},
			{ status: 200 }
		);
	} catch (error) {
		// Handle server errors
		console.error("Error fetching cart:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
