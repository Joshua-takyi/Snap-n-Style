import { User } from "@/model/schema";
import ConnectDb from "@/utils/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req) {
	const { firstName, lastName, email, password } = await req.json();
	try {
		if (!firstName || !lastName || !email || !password) {
			return NextResponse.json(
				{
					message: "All fields are required",
				},
				{ status: 400 }
			);
		}

		// check if user already exists
		await ConnectDb();

		const user = await User.findOne({ email }).select("+password +role");
		if (user) {
			return NextResponse.json(
				{
					message: "user already exist",
				},
				{ status: 400 }
			);
		}
		// hash password

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			role: "user",
		});
		return NextResponse.json(
			{
				message: "user created successfully",
				id: newUser.id,
			},
			{
				status: 201,
			}
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
