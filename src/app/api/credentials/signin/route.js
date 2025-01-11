import { signIn } from "@/libs/auth";
import ConnectDb from "@/utils/connect";

export async function POST(req) {
	const { email, password } = await req.json();

	try {
		await ConnectDb();

		const user = await User.findOne({ email }).select("+password +role");

		if (!user) {
			return NextResponse.json(
				{
					message: "user not found",
				},
				{ status: 404 }
			);
		}

		const signinOp = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (signinOp.error) {
			return NextResponse.json(
				{
					message: "Invalid credentials",
				},
				{ status: 401 }
			);
		}
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
