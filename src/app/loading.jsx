"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Loader() {
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<motion.div
				className="relative w-28 h-28"
				animate={{
					rotate: 360, // Rotate the container for a spinning effect
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				{/* Box 1 */}
				<motion.div
					className="absolute border-4 border-gray-200 box-border"
					initial={{
						width: "112px",
						height: "48px",
						top: "64px",
						left: "0px",
					}}
					animate={{
						width: [
							"112px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
						],
						height: [
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"112px",
							"48px",
							"48px",
						],
						top: [
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"0px",
							"0px",
							"0px",
						],
						left: [
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
						],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Box 2 */}
				<motion.div
					className="absolute border-4 border-gray-200 box-border"
					initial={{
						width: "48px",
						height: "48px",
						top: "0px",
						left: "0px",
					}}
					animate={{
						width: [
							"48px",
							"48px",
							"48px",
							"48px",
							"112px",
							"48px",
							"48px",
							"48px",
							"48px",
						],
						height: [
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
						],
						top: [
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
						],
						left: [
							"0px",
							"0px",
							"0px",
							"0px",
							"0px",
							"64px",
							"64px",
							"64px",
							"64px",
						],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Box 3 */}
				<motion.div
					className="absolute border-4 border-gray-200 box-border"
					initial={{
						width: "48px",
						height: "48px",
						top: "0px",
						left: "64px",
					}}
					animate={{
						width: [
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"112px",
						],
						height: [
							"48px",
							"48px",
							"112px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
							"48px",
						],
						top: [
							"0px",
							"0px",
							"0px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
						],
						left: [
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"64px",
							"0px",
						],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</motion.div>
		</div>
	);
}
