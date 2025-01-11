"use server";

import {  signIn } from "@/libs/auth";
import ConnectDb from "@/utils/connect";
import { redirect } from "next/navigation";

export async function signInAction(formData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	try {
		await ConnectDb(); 

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return { error: result.error };
		}

		// note:: Redirect on success
		redirect("/");
	} catch (error) {
		console.error("Sign-in failed:", error);
		return { error: "An error occurred during sign-in" };
	}
}