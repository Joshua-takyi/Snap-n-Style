"use client";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const DropdownMenu = ({ header, items }) => {
	const [isHovered, setIsHovered] = useState(false);

	const underlineVariant = {
		hidden: { width: "0%" },
		show: {
			width: "100%",
			transition: { duration: 0.3, ease: "easeOut" },
		},
	};

	const dropdownVariant = {
		hidden: {
			opacity: 0,
			y: -10,
			transition: { duration: 0.2 },
		},
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, staggerChildren: 0.05 },
		},
	};

	const sectionVariant = {
		hidden: { opacity: 0, y: -10 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Header */}
			<div className="relative inline-block py-2 cursor-pointer">
				<p className="text-[1rem] font-semibold text-gray-700 p-2s capitalize">
					{header}
				</p>
				<motion.div
					className="absolute bottom-0 left-0 h-0.5 bg-black"
					initial="hidden"
					animate={isHovered ? "show" : "hidden"}
					variants={underlineVariant}
				/>
			</div>

			{/* Dropdown */}
			<AnimatePresence>
				{isHovered && (
					<motion.div
						className="absolute left-0 z-50 w-screen max-w-screen-2xl py-4 mt-2 bg-white  ring-1 ring-black ring-opacity-5 flex justify-start overflow-hidden"
						initial="hidden"
						animate="show"
						exit="hidden"
						variants={dropdownVariant}
					>
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6">
							{items.map((section) => (
								<motion.div key={section.id} variants={sectionVariant}>
									<p className="font-bold text-sm text-gray-800 mb-2">
										{section.header}
									</p>
									<div className="flex flex-col gap-2">
										{section.items.map((item, idx) => (
											<Link
												key={idx}
												href={`/collection?category=${section.header
													.toLowerCase()
													.replace(
														/\s+/g,
														"-"
													)}&sortBy=price&sortOrder=desc&limit=50&page=1&tags=${item.name
													.toLowerCase()
													.replace(/\s+/g, "-")}`}
											>
												<span className="block text-sm text-gray-600 hover:text-gray-900 hover:underline">
													{item.name}
												</span>
											</Link>
										))}
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

DropdownMenu.propTypes = {
	header: PropTypes.string.isRequired,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			header: PropTypes.string.isRequired,
			items: PropTypes.arrayOf(
				PropTypes.shape({
					name: PropTypes.string.isRequired,
					href: PropTypes.string.isRequired,
				})
			).isRequired,
		})
	).isRequired,
};

export default DropdownMenu;
