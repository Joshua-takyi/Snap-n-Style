"use server";
import { signIn } from "@/libs/auth";

export const SignInAction = async ({ email, password }) => {
	try {
		// Call NextAuth's signIn function with the credentials provider
		await signIn("credentials", {
			email,
			password,
			redirect: false, // Disable automatic redirection
		});
		// If successful, return a success message
		return { success: "Sign-in successful!" };
	} catch (error) {
		// Handle authentication errors
		if (error) {
			if (error.type == "CredentialsSignin") {
				return { error: "Invalid email or password" };
			} else {
				return { error: "An error occurred during sign-in" };
			}
		}

		// Handle other errors
		console.error("Sign-in error occurred");
		return { error: "An unexpected error occurred" };
	}
};
