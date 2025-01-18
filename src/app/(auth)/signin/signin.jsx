"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { SignInAction } from "@/server/action";

const signinSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export default function SigninPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [generalError, setGeneralError] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(signinSchema),
	});

	const onSubmit = async (data) => {
		try {
			const response = await SignInAction(data);
			if (response?.error) {
				setGeneralError(response.error);
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
			{/* Left side - Branding */}
			<div className="hidden md:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
				<div className="max-w-md space-y-6 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900">
						Welcome back to Snap n&apos; Style
					</h1>
					<p className="text-lg text-gray-600">
						Sign in to continue your style journey
					</p>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
						{/* Mobile branding */}
						<div className="md:hidden text-center mb-6">
							<h1 className="text-2xl font-bold tracking-tight text-gray-900">
								Snap n&apos; Style
							</h1>
						</div>

						<div className="mb-6">
							<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
								Sign in to your account
							</h2>
							<p className="mt-2 text-sm text-gray-600">
								Enter your email and password below
							</p>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700"
									>
										Password
									</label>
									<Link
										href="/forgot-password"
										className="text-sm font-medium text-blue-600 hover:text-blue-500"
									>
										Forgot password?
									</Link>
								</div>
								<div className="relative mt-1">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										autoComplete="current-password"
										{...register("password")}
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
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
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
										Signing in...
									</div>
								) : (
									"Sign in"
								)}
							</button>

							<p className="mt-4 text-center text-sm text-gray-600">
								Don&apos;t have an account?{" "}
								<Link
									href="/signup"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Sign up
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
