import { SideBar } from "@/components/sidebar/sidebar";
import Wrapper from "@/components/wrapper/wrapper";
import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "../loading";

export default async function AdminLayout({ children }) {
	// Fetch the session
	const session = await auth();

	// Redirect if the user is not an admin
	if (session?.user?.role !== "admin") {
		redirect("/");
	}

	return (
		<div className="flex min-h-screen">
			<SideBar />
			<div className="flex-1 md:ml-64">
				<Suspense fallback={<Loader />}>
					<Wrapper className="p-5">{children}</Wrapper>
				</Suspense>
			</div>
		</div>
	);
}
