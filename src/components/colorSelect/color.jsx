"use client";
import React from "react";
import { Check } from "lucide-react";

export const ColorSelect = ({
	colors = [],
	value,
	onChange,
	title = "Colors:",
}) => {
	// Function to determine if text should be white or black based on background color
	const getContrastColor = (hexColor) => {
		// Convert hex to RGB
		const r = parseInt(hexColor.slice(1, 3), 16);
		const g = parseInt(hexColor.slice(3, 5), 16);
		const b = parseInt(hexColor.slice(5, 7), 16);

		// Calculate relative luminance
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		return luminance > 0.5 ? "#000000" : "#FFFFFF";
	};

	return (
		<div className="flex gap-2 flex-col">
			<span className="text-normalText font-medium text-[#a8a9a8]">
				{title}
			</span>
			<div className="flex gap-2 flex-wrap">
				{colors.map((color) => {
					const isSelected = color === value;
					const contrastColor = getContrastColor(color);

					return (
						<button
							key={color}
							onClick={() => onChange(color)}
							className={`
                size-10 rounded-none relative
                transition-all duration-200 ease-in-out
                ${
									isSelected
										? "ring-2 ring-offset-2 ring-blue-500"
										: "border border-gray-200"
								}
                hover:scale-110 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
							style={{
								backgroundColor: color,
							}}
							title={color}
						>
							{isSelected && (
								<Check
									className="absolute inset-0 m-auto"
									size={16}
									color={contrastColor}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default ColorSelect;
