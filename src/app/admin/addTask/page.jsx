import { auth } from "@/libs/auth";
import AddTask from "./task";
import { redirect } from "next/navigation";

export default async function AddTaskPage() {
	const session = await auth();
	if (session?.user?.role !== "admin") {
		return redirect("/");
	}
	return <AddTask />;
}
