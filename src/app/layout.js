import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/provider/query";
import { Nav } from "@/components/nav/nav";
import { Suspense } from "react";
import Loader from "./loading";
import { headers } from "next/headers"; // Import headers to get the full URL
import { Toaster } from "sonner";

// Define local fonts
const Rauschen = localFont({
	src: "../fonts/Rauschen-BBook-Web.woff",
	variable: "--font-Rauschen-BBook-Web",
});

export const metadata = {
	title: "Snap n' Style",
	description:
		"Discover premium phone cases, AirPods cases, and watch bands at Snap n' Style. Elevate your everyday accessories with our stylish, durable, and functional designs. Shop now for the perfect blend of fashion and protection!",
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${Rauschen.className} antialiased`}>
				<Suspense fallback={<Loader />}>
					<QueryProvider>
						<Nav />
						{children}
						<Toaster position="top-right" richColors />
					</QueryProvider>
				</Suspense>
			</body>
		</html>
	);
}
