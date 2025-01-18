"use client";
import React from "react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";

export const SelectPhoneModel = ({
	itemModel = [],
	value,
	onChange,
	title,
}) => {
	// Sort models directly
	const sortedModels = React.useMemo(() => {
		return itemModel.sort((a, b) => {
			if (a.includes("pro max")) return -1;
			if (b.includes("pro max")) return 1;
			if (a.includes("pro")) return -1;
			if (b.includes("pro")) return 1;
			return a.localeCompare(b); // Alphabetical sorting for non-Pro models
		});
	}, [itemModel]);

	return (
		<div className="w-full max-w-full space-y-2 rounded-none">
			{title && (
				<label className="text-sm font-medium text-gray-700">{title}</label>
			)}

			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-full rounded-none focus:ring-0 outline-none">
					<SelectValue placeholder="Choose a model" />
				</SelectTrigger>
				<SelectContent className="rounded-none">
					{sortedModels.map((model) => (
						<SelectItem key={model} value={model} className="capitalize">
							{model.replace("iphone", "").trim()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default SelectPhoneModel;
