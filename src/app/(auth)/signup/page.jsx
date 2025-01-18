import { auth } from "@/libs/auth";
import SignupPage from "./signup";

export default function Signup() {
	const getSession = async () => {
		const session = await auth();
		if (session) {
			redirect("/");
		}
	};
	getSession();
	return <SignupPage />;
}
