"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const TabComponent = ({ data }) => {
	const [activeTab, setActiveTab] = useState("description");

	const tabs = [
		{ id: "description", label: "Description" },
		{ id: "details", label: "Details" },
		{ id: "materials", label: "Materials" },
	];

	const getTabPosition = (index) => ({
		left: `${index * 100}%`,
	});

	return (
		<div className="flex flex-col md:gap-10 gap-4 max-w-5xl w-full">
			<div className="text-normalText leading-5">
				{/* Tab Headers */}
				<div className="relative flex border-b border-gray-300">
					{tabs.map((tab, index) => (
						<div
							key={tab.id}
							className="relative flex-1 text-center"
							onClick={() => setActiveTab(tab.id)}
						>
							<button
								className={`w-full py-2 text-sm font-medium focus:outline-none ${
									activeTab === tab.id ? "text-black" : "text-[#e0e1e0]"
								}`}
							>
								{tab.label}
							</button>
							{/* Active Border */}
							{activeTab === tab.id && (
								<motion.div
									className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
									layoutId="active-tab"
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
								/>
							)}
						</div>
					))}
				</div>

				{/* Tab Content */}
				<motion.div
					key={activeTab}
					className="mt-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
				>
					{activeTab === "description" && <p>{data.description}</p>}
					{activeTab === "details" && (
						<ul className="list-disc pl-4">
							{data.details.map((detail, index) => (
								<li key={index}>{detail}</li>
							))}
						</ul>
					)}
					{activeTab === "materials" && (
						<ul className="list-disc pl-4">
							{data.materials.map((material, index) => (
								<li key={index}>{material}</li>
							))}
						</ul>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default TabComponent;
