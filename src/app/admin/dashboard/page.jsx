import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await auth();

	// Redirect if the user is not an admin
	if (session?.user.role !== "admin") {
		redirect("/unauthorized");
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Admin Dashboard</h1>
			<p className="mt-4 text-gray-700">Welcome to the admin dashboard!</p>
		</div>
	);
}
