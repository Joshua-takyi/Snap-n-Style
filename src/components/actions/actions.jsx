"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const Actions = ({ icon, text, data, className }) => {
	const [isOpen, setIsOpen] = useState(false);

	// Animation variants for the sliding menu
	const menuVariant = {
		hidden: {
			opacity: 0,
			x: "100%", // Start off-screen to the right
		},
		visible: {
			opacity: 1,
			x: 0, // Slide into view
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
	};

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleBackdropClick = (e) => {
		if (e.target.id === "backdrop") {
			setIsOpen(false); // Close the menu when clicking outside
		}
	};

	return (
		<>
			{/* Trigger Button */}
			<div
				onClick={toggleMenu}
				className="cursor-pointer flex items-center gap-2"
			>
				<Image src={icon} alt={text} width={20} height={20} />
				<p>{text}</p>
			</div>

			{/* Backdrop */}
			{isOpen && (
				<motion.div
					id="backdrop"
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={handleBackdropClick}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				/>
			)}

			{/* Sliding Menu */}
			<motion.div
				className={`fixed top-0 right-0 h-full md:w-[30rem] w-2/3 bg-white shadow-lg z-50 p-6 ${className}`}
				variants={menuVariant}
				initial="hidden"
				animate={isOpen ? "visible" : "hidden"}
			>
				{/* Content Header */}
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-lg font-bold">{text}</h1>
					<button
						onClick={() => setIsOpen(false)}
						className="text-xl font-bold text-gray-500 hover:text-black"
					>
						&times;
					</button>
				</div>

				{/* Content Body */}
				<div className="overflow-y-auto">
					{/* Render data items dynamically */}
					{data?.length > 0 ? (
						<ul className="flex flex-col md:gap-20 gap-10">
							{data.map((item) => (
								<li
									key={item.id}
									className="flex items-center gap-4 relative aspect-square w-full overflow-hidden bg-transparent"
								>
									<Image
										src={item.image}
										alt={item.alt}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
										className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105 imgBg drop-shadow-md"
									/>

									<p className="text-blue-500 hover:underline">{item.alt}</p>
								</li>
							))}
						</ul>
					) : (
						<p>No items available</p>
					)}
				</div>
			</motion.div>
		</>
	);
};
