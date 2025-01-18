"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const signupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Please enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least one special character"
		),
});

export default function SignupPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [generalError, setGeneralError] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data) => {
		try {
			setGeneralError(null);
			const response = await axios.post(`${API_URL}/credentials/signup`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 201) {
				router.push("/signin");
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setGeneralError(
					error.response?.data?.message ||
						"An error occurred during signup. Please try again."
				);
			} else {
				setGeneralError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
			{/* Left side - Branding */}
			<div className="hidden md:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
				<div className="max-w-md space-y-6 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900">
						Welcome to Snap n&apos; Style
					</h1>
					<p className="text-lg text-gray-600">
						Join our community and discover a new way to express your style
					</p>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="flex items-center justify-center p-4 md:p-8">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-md p-6 md:p-8">
						<div className="mb-6">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
								Create an account
							</h2>
							<p className="mt-2 text-sm text-gray-600">
								Enter your details below to create your account
							</p>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="firstName"
										className="block text-sm font-medium text-gray-700"
									>
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										{...register("firstName")}
										className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
										placeholder="John"
									/>
									{errors.firstName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.firstName.message}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="lastName"
										className="block text-sm font-medium text-gray-700"
									>
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										{...register("lastName")}
										className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
										placeholder="Doe"
									/>
									{errors.lastName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									autoComplete="email"
									{...register("email")}
									className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-base shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									placeholder="you@example.com"
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600">
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<div className="relative mt-1">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										{...register("password")}
										autoComplete="current-password"
										className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-base shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
										placeholder="••••••••"
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-gray-500" />
										) : (
											<Eye className="h-4 w-4 text-gray-500" />
										)}
									</button>
								</div>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</div>

							{generalError && (
								<div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
									{generalError}
								</div>
							)}

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<div className="flex items-center">
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Creating account...
									</div>
								) : (
									"Sign up"
								)}
							</button>

							<p className="mt-4 text-center text-sm text-gray-600">
								Already have an account?{" "}
								<Link
									href="/signin"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Sign in
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
