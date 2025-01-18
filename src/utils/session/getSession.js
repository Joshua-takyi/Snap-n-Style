"use server";
import { auth } from "@/libs/auth";
import { cache } from "react";
export const GetSession = cache(async () => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}
	return session;
});
