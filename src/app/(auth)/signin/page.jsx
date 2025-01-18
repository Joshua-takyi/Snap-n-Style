import { redirect } from "next/navigation";
import SignInPage from "./signin";
import { auth } from "@/libs/auth";

export default async function SignIn() {
	const session = await auth();
	console.dir(session);
	if (session?.user) {
		return redirect("/");
	}
	return <SignInPage />;
}
