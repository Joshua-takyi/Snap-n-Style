"use client";
import PropTypes from "prop-types";
import { useState } from "react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectGroup,
} from "@/components/ui/select";
import { Tag, X, Plus } from "lucide-react";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AddTask = () => {
	const [data, setData] = useState({
		itemName: "",
		description: "",
		price: "",
		image: [],
		category: "",
		brand: "",
		stock: "",
		discount: "",
		itemModel: [],
		tags: [],
		details: [],
		isOnSale: false,
		colors: [],
		materials: [],
		features: [],
	});

	// Handle Cloudinary upload success
	const handleUploadSuccess = (result) => {
		const { secure_url } = result.info; // Get the secure URL of the uploaded image
		setData((prev) => ({ ...prev, image: [...prev.image, secure_url] })); // Add the image URL to the state
		toast.success("Image uploaded successfully!");
	};

	// Handle deleting an image
	const handleDeleteImage = (index) => {
		setData((prev) => ({
			...prev,
			image: prev.image.filter((_, i) => i !== index),
		}));
		toast.success("Image deleted!");
	};

	// Handle selecting a category
	const handleSelectOption = (value) => {
		setData((prev) => ({ ...prev, category: value }));
		toast.success("Category selected!");
	};

	// Handle deleting a category
	const handleDeleteOption = () => {
		setData((prev) => ({ ...prev, category: "" }));
		toast.success("Category removed!");
	};

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle adding a new tag
	const handleAddTag = (tag) => {
		if (!data.tags.includes(tag)) {
			setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
			toast.success("Tag added!");
		} else {
			toast.error("Tag already exists!");
		}
	};

	// Handle deleting a tag
	const handleDeleteTag = (tag) => {
		setData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
		toast.success("Tag removed!");
	};

	// Handle adding a new detail input field
	const handleAddDetail = () => {
		setData((prev) => ({ ...prev, details: [...prev.details, ""] }));
	};

	// Handle changing a detail input field
	const handleDetailChange = (index, value) => {
		const updatedDetails = [...data.details];
		updatedDetails[index] = value;
		setData((prev) => ({ ...prev, details: updatedDetails }));
	};

	const handleDeleteDetail = (index) => {
		const updatedDetails = data.details.filter((_, i) => i !== index);
		setData((prev) => ({ ...prev, details: updatedDetails }));
	};

	const handleAddModel = () => {
		setData((prev) => ({ ...prev, itemModel: [...prev.itemModel, ""] }));
	};

	const handleModelChange = (index, value) => {
		const updatedModels = [...data.itemModel];
		updatedModels[index] = value;
		setData((prev) => ({ ...prev, itemModel: updatedModels }));
	};

	const handleDeleteModel = (index) => {
		const updatedModels = data.itemModel.filter((_, i) => i !== index);
		setData((prev) => ({ ...prev, itemModel: updatedModels }));
	};
	// features
	const handleAddFeatures = () => {
		setData((prev) => ({ ...prev, features: [...prev.features, ""] }));
	};

	const handleFeaturesChange = (index, value) => {
		const updatedModels = [...data.features];
		updatedModels[index] = value;
		setData((prev) => ({ ...prev, features: updatedModels }));
	};

	const handleDeleteFeatures = (index) => {
		const updatedModels = data.features.filter((_, i) => i !== index);
		setData((prev) => ({ ...prev, features: updatedModels }));
	};
	// materials
	const handleAddMaterials = () => {
		setData((prev) => ({ ...prev, materials: [...prev.materials, ""] }));
	};

	const handleMaterialsChange = (index, value) => {
		const updatedModels = [...data.materials];
		updatedModels[index] = value;
		setData((prev) => ({ ...prev, materials: updatedModels }));
	};

	const handleDeleteMaterials = (index) => {
		const updatedModels = data.materials.filter((_, i) => i !== index);
		setData((prev) => ({ ...prev, materials: updatedModels }));
	};
	// Handle adding a new color
	const handleAddColors = () => {
		setData((prev) => ({ ...prev, colors: [...prev.colors, "#000000"] }));
	};

	const handleColorsChange = (index, value) => {
		const updatedColors = [...data.colors];
		updatedColors[index] = value;
		setData((prev) => ({ ...prev, colors: updatedColors }));
	};

	const handleDeleteColor = (index) => {
		const updatedColors = data.colors.filter((_, i) => i !== index);
		setData((prev) => ({ ...prev, colors: updatedColors }));
		toast.success("Color removed!");
	};

	// Find the label for a category value
	const findOptionLabel = (value) => {
		for (const group of categories) {
			const option = group.items.find((item) => item.value === value);
			if (option) return option.label;
		}
		return "Unknown";
	};

	// Mutation for creating a product
	const { mutate, isLoading } = useMutation({
		mutationFn: async (productData) => {
			const res = await axios.post(`${API_URL}/product`, productData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			toast.success("Product created successfully!");
			setData({
				itemName: "",
				description: "",
				price: "",
				image: [],
				category: "",
				brand: "",
				stock: "",
				discount: "",
				itemModel: [],
				tags: [],
				details: [],
				colors: [],
				materials: [],
				features: [],
				isOnSale: false,
			});
		},
		onError: () => {
			toast.error("Failed to create product. Please try again.");
		},
	});

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();

		// Validate all required fields
		if (!data.itemName.trim()) {
			toast.error("Item name is required");
			return;
		}
		if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
			toast.error("Valid price is required");
			return;
		}
		if (!data.category) {
			toast.error("Category is required");
			return;
		}
		if (!data.brand.trim()) {
			toast.error("Brand is required");
			return;
		}
		if (!data.stock || isNaN(data.stock) || Number(data.stock) <= 0) {
			toast.error("Valid stock quantity is required");
			return;
		}
		if (data.image.length === 0) {
			toast.error("At least one product image is required");
			return;
		}
		if (data.itemModel.length === 0) {
			toast.error("At least one item model is required");
			return;
		}
		if (data.details.length === 0) {
			toast.error("At least one detail is required");
			return;
		}
		if (data.tags.length === 0) {
			toast.error("At least one tag is required");
			return;
		}
		if (data.colors.length === 0) {
			toast.error("At least one color is required");
			return;
		}
		if (data.materials.length === 0) {
			toast.error("At least one material is required");
			return;
		}
		if (data.features.length === 0) {
			toast.error("At least one feature is required");
			return;
		}

		// Filter out any empty strings from arrays
		const cleanedData = {
			...data,
			itemModel: data.itemModel.filter((model) => model.trim()),
			details: data.details.filter((detail) => detail.trim()),
			materials: data.materials.filter((material) => material.trim()),
			features: data.features.filter((feature) => feature.trim()),
		};

		mutate(cleanedData);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-xl shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						Add New Product
					</h1>
					<form className="space-y-8" onSubmit={handleSubmit}>
						{/* Basic Information Section */}
						<div className="space-y-6">
							<p className="text-xl font-semibold text-gray-800">
								Basic Information
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label
										htmlFor="itemName"
										className="text-sm font-medium text-gray-700"
									>
										Item Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="itemName"
										value={data.itemName}
										onChange={handleChange}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter product name"
										required
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="brand"
										className="text-sm font-medium text-gray-700"
									>
										Brand
									</label>
									<input
										type="text"
										name="brand"
										value={data.brand}
										onChange={handleChange}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter brand name"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label
									htmlFor="description"
									className="text-sm font-medium text-gray-700"
								>
									Description
								</label>
								<textarea
									name="description"
									value={data.description}
									onChange={handleChange}
									rows={4}
									className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									placeholder="Enter product description"
								/>
							</div>
							<div className="grid md:grid-cols-3 grid-cols-1 gap-6 align-middle">
								<div className="flex flex-col gap-2">
									<label htmlFor="discount">Discount</label>
									<input
										type="number"
										name="discount"
										value={data.discount}
										onChange={handleChange}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter discount"
									/>
								</div>

								<div className="grid grid-cols-1 gap-6">
									<div>
										<label htmlFor="tags">Tags</label>
										<div className="flex flex-wrap gap-2 mb-3">
											{data.tags.map((tag) => (
												<div
													key={tag}
													className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg"
												>
													<Tag size={16} />
													<span className="text-sm font-medium">{tag}</span>
													<button
														type="button"
														onClick={() => handleDeleteTag(tag)}
														className="hover:bg-blue-100 rounded-full p-1"
													>
														<X size={16} />
													</button>
												</div>
											))}
										</div>
										<CustomSelect
											options={tags}
											onChange={handleAddTag}
											placeholder="Add a tag"
											className="w-full md:w-[280px]"
										/>
									</div>
								</div>
								<div className="flex items-center gap-2 p-2">
									<label
										htmlFor="isOnSale"
										className="text-sm font-medium text-gray-700"
									>
										On Sale
									</label>
									<input
										type="checkbox"
										name="isOnSale"
										checked={data.isOnSale}
										onChange={(e) => {
											setData((prev) => ({
												...prev,
												isOnSale: e.target.checked,
											}));
										}}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label
										htmlFor="stock"
										className="text-sm font-medium text-gray-700"
									>
										Stock
									</label>
									<input
										type="number"
										name="stock"
										value={data.stock}
										onChange={handleChange}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter stock"
									/>
								</div>
							</div>
						</div>

						{/* Categories Section */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<p className="text-xl font-semibold text-gray-800">
									Categories <span className="text-red-500">*</span>
								</p>
								{data.category && (
									<div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg mb-3">
										<Tag size={16} />
										<span className="text-sm font-medium">
											{findOptionLabel(data.category)}
										</span>
										<button
											type="button"
											onClick={handleDeleteOption}
											className="hover:bg-blue-100 rounded-full p-1"
										>
											<X size={16} />
										</button>
									</div>
								)}
								<CustomSelect
									options={categories}
									onChange={handleSelectOption}
									placeholder="Select a category"
									className="w-full md:w-[280px]"
								/>
							</div>
							<div>
								<label
									htmlFor="price"
									className="text-sm font-medium text-gray-700"
								>
									Price <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									name="price"
									value={data.price}
									onChange={handleChange}
									className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									placeholder="Enter price"
									required
								/>
							</div>
						</div>
						{/* materials */}
						<div>
							<div className="space-y-4">
								<p className="text-xl font-semibold text-gray-800">Materials</p>
								{data.materials.map((material, index) => (
									<div key={index} className="flex items-center gap-2">
										<input
											type="text"
											value={material}
											onChange={(e) =>
												handleMaterialsChange(index, e.target.value)
											}
											className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
											placeholder="Enter material"
										/>
										<button
											type="button"
											onClick={() => handleDeleteMaterials(index)}
											className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
										>
											<X size={16} />
										</button>
									</div>
								))}
								<button
									type="button"
									onClick={handleAddMaterials}
									className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
								>
									<Plus size={16} />
									<span>Add Material</span>
								</button>
							</div>
						</div>

						{/* colors */}
						<div>
							<div className="space-y-4">
								<p className="text-xl font-semibold text-gray-800">Colors</p>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{data.colors.map((color, index) => (
										<div
											key={index}
											className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
										>
											<input
												type="color"
												value={color}
												onChange={(e) =>
													handleColorsChange(index, e.target.value)
												}
												className="w-12 h-12 p-1 rounded cursor-pointer"
											/>
											<div className="flex-1">
												<p className="text-sm font-medium">{color}</p>
											</div>
											<button
												type="button"
												onClick={() => handleDeleteColor(index)}
												className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
											>
												<X size={16} />
											</button>
										</div>
									))}
								</div>
								<button
									type="button"
									onClick={handleAddColors}
									className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
								>
									<Plus size={16} />
									<span>Add Color</span>
								</button>
							</div>
						</div>
						{/* features */}
						<div>
							<div className="space-y-4">
								<p className="text-xl font-semibold text-gray-800">Features</p>
								{data.features.map((features, index) => (
									<div key={index} className="flex items-center gap-2">
										<input
											type="text"
											value={features}
											onChange={(e) =>
												handleFeaturesChange(index, e.target.value)
											}
											className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
											placeholder="Enter feature"
										/>
										<button
											type="button"
											onClick={() => handleDeleteFeatures(index)}
											className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
										>
											<X size={16} />
										</button>
									</div>
								))}
								<button
									type="button"
									onClick={handleAddFeatures}
									className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
								>
									<Plus size={16} />
									<span>Add Feature</span>
								</button>
							</div>
						</div>

						{/* Details Section */}
						<div className="space-y-4">
							<p className="text-xl font-semibold text-gray-800">Details</p>
							{data.details.map((detail, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={detail}
										onChange={(e) => handleDetailChange(index, e.target.value)}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter detail"
									/>
									<button
										type="button"
										onClick={() => handleDeleteDetail(index)}
										className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
									>
										<X size={16} />
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={handleAddDetail}
								className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
							>
								<Plus size={16} />
								<span>Add Detail</span>
							</button>
						</div>
						{/* Item Model Section */}
						<div className="space-y-4">
							<p className="text-xl font-semibold text-gray-800">Item Models</p>
							{data.itemModel.map((model, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={model}
										onChange={(e) => handleModelChange(index, e.target.value)}
										className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										placeholder="Enter model"
									/>
									<button
										type="button"
										onClick={() => handleDeleteModel(index)}
										className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
									>
										<X size={16} />
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={handleAddModel}
								className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
							>
								<Plus size={16} />
								<span>Add Model</span>
							</button>
						</div>
						{/* Image Upload Section */}
						<div className="space-y-4">
							<p className="text-xl font-semibold text-gray-800">
								Product Images <span className="text-red-500">*</span>
							</p>
							<CldUploadWidget
								uploadPreset="snapNstyle" // Replace with your Cloudinary upload preset
								onSuccess={handleUploadSuccess} // Handle successful uploads
								options={{
									multiple: true,
									maxFiles: 4,
									transformation: [
										{
											width: 500,
											height: 300,
											crop: "fill",
										},
										{ quality: "auto", fetch_format: "auto" }, // Auto format and quality
									],
								}}
							>
								{({ open }) => {
									return (
										<button
											type="button"
											onClick={() => open()}
											className="bg-blue-500 text-white hover:bg-blue-400/30 p-4 rounded-md transition-all"
										>
											Upload an Image
										</button>
									);
								}}
							</CldUploadWidget>
							{data.image.length > 0 && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{data.image.map((url, index) => (
										<div key={index} className="relative group">
											<div className="aspect-square rounded-lg overflow-hidden">
												<Image
													src={url}
													alt={`Product ${index + 1}`}
													width={400}
													height={400}
													className="object-cover w-full h-full"
												/>
											</div>
											<button
												type="button"
												onClick={() => handleDeleteImage(index)}
												className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
											>
												<X size={16} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Submit Button */}
						<div className="pt-6">
							<button
								type="submit"
								className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								disabled={isLoading}
							>
								{isLoading ? "Saving..." : "Save Product"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddTask;

const CustomSelect = ({ options, onChange, placeholder, className }) => {
	return (
		<Select onValueChange={onChange}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map((group) => (
					<SelectGroup key={group.label}>
						<SelectLabel className="font-bold text-sm text-gray-700">
							{group.label}
						</SelectLabel>
						{group.items.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
							>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				))}
			</SelectContent>
		</Select>
	);
};

CustomSelect.propTypes = {
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	className: PropTypes.string,
};

const categories = [
	{
		label: "Phone Cases & Covers",
		items: [
			{ label: "Phone Cases", value: "phone-cases" },
			{ label: "Screen Protectors", value: "screen-protectors" },
			{ label: "Camera Lens Protectors", value: "camera-protectors" },
			{ label: "Back Films", value: "protective-films" },
		],
	},
	{
		label: "Power & Charging",
		items: [
			{ label: "Charging Cables", value: "charging-cables" },
			{ label: "Wall Chargers", value: "wall-chargers" },
			{ label: "Wireless Chargers", value: "wireless-chargers" },
			{ label: "Car Chargers", value: "car-chargers" },
			{ label: "Power Banks", value: "power-banks" },
		],
	},
	{
		label: "Mounts & Holders",
		items: [
			{ label: "Car Mounts", value: "car-mounts" },
			{ label: "Desk Stands", value: "desk-stands" },
			{ label: "Phone Grips & Rings", value: "phone-grips" },
			{ label: "Bike Mounts", value: "bike-mounts" },
		],
	},
	{
		label: "Audio Accessories",
		items: [
			{ label: "Airpod Cases", value: "airpod-cases" },
			{ label: "Bluetooth Earphones", value: "bluetooth-earphones" },
			{ label: "Audio Adapters", value: "audio-adapters" },
			{ label: "Earphone Cases", value: "earphone-cases" },
		],
	},
	{
		label: "Camera Accessories",
		items: [
			{ label: "Camera Lenses", value: "camera-lenses" },
			{ label: "Selfie Sticks", value: "selfie-sticks" },
			{ label: "Camera Stabilizers", value: "camera-stabilizers" },
			{ label: "Phone Tripods", value: "tripods" },
		],
	},
	{
		label: "Storage & Connectivity",
		items: [
			{ label: "Memory Cards", value: "memory-cards" },
			{ label: "OTG Adapters", value: "otg-adapters" },
			{ label: "Card Readers", value: "card-readers" },
			{ label: "USB Cables", value: "usb-cables" },
		],
	},
	{
		label: "Wearables",
		items: [
			{ label: "Smart Watches", value: "smart-watches" },
			{ label: "Watch Straps", value: "watch-straps" },
			{ label: "Watch Chargers", value: "watch-chargers" },
			{ label: "Watch Screen Protectors", value: "watch-protectors" },
		],
	},
	{
		label: "Maintenance",
		items: [
			{ label: "Cleaning Kits", value: "cleaning-kits" },
			{ label: "Repair Tools", value: "repair-tools" },
			{ label: "Replacement Parts", value: "replacement-parts" },
			{ label: "Cleaning Solutions", value: "cleaning-solutions" },
		],
	},
];

const tags = [
	{
		label: "Phone Cases",
		items: [
			{ label: "iPhone Cases", value: "iphone-cases" },
			{ label: "Galaxy Cases", value: "galaxy-cases" },
			{ label: "OnePlus Cases", value: "oneplus-cases" },
			{ label: "Pixel Cases", value: "pixel-cases" },
			{ label: "Clear Cases", value: "clear-cases" },
			{ label: "Leather Cases", value: "leather-cases" },
			{ label: "Rugged Cases", value: "rugged-cases" },
		],
	},
	{
		label: "Screen Protectors",
		items: [
			{ label: "Tempered Glass", value: "tempered-glass" },
			{
				label: "Privacy Screen Protectors",
				value: "privacy-screen-protectors",
			},
			{ label: "Anti-Glare Protectors", value: "anti-glare-protectors" },
			{ label: "Self-Healing Protectors", value: "self-healing-protectors" },
		],
	},
	{
		label: "Chargers & Cables",
		items: [
			{ label: "Fast Chargers", value: "fast-chargers" },
			{ label: "Wireless Chargers", value: "wireless-chargers" },
			{ label: "USB-C Cables", value: "usb-c-cables" },
			{ label: "Lightning Cables", value: "lightning-cables" },
			{ label: "Car Chargers", value: "car-chargers" },
			{ label: "Multi-Port Chargers", value: "multi-port-chargers" },
		],
	},
	{
		label: "Earphones & Headphones",
		items: [
			{ label: "AirPods", value: "airpods" },
			{ label: "Galaxy Buds", value: "galaxy-buds" },
			{ label: "Wireless Earbuds", value: "wireless-earbuds" },
			{
				label: "Noise-Cancelling Headphones",
				value: "noise-cancelling-headphones",
			},
			{ label: "Sports Earphones", value: "sports-earphones" },
		],
	},
	{
		label: "Power Banks",
		items: [
			{ label: "20,000mAh Power Banks", value: "20000mah-power-banks" },
			{ label: "10,000mAh Power Banks", value: "10000mah-power-banks" },
			{ label: "Slim Power Banks", value: "slim-power-banks" },
			{ label: "Solar Power Banks", value: "solar-power-banks" },
		],
	},
	{
		label: "Smartwatch Accessories",
		items: [
			{ label: "Apple Watch Bands", value: "apple-watch-bands" },
			{ label: "Galaxy Watch Bands", value: "galaxy-watch-bands" },
			{ label: "Charging Docks", value: "charging-docks" },
			{ label: "Screen Protectors", value: "smartwatch-screen-protectors" },
		],
	},
];
