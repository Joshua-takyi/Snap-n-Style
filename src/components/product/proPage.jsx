"use client";

import { SelectPhoneModel } from "@/components/accordion/accord";
import { BreadcrumbComponent } from "@/components/bread/bread";
import { ImageCarousel } from "@/components/carousel/image";
import Wrapper from "@/components/wrapper/wrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import axios from "axios";
import ColorSelect from "../colorSelect/color";
import { useState } from "react";
import TabComponent from "../tab/tab";
import Loader from "@/app/loading";
import { GetSession } from "@/utils/session/getSession";
import { toast, Toaster } from "sonner";

// Format price as currency
const formatPrice = (price, currency = "GHS") => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

export default function Product({ id }) {
	const [color, setColor] = useState(""); // State for selected color
	const [quantity, setQuantity] = useState(1); // State for quantity
	const [selectedModel, setSelectedModel] = useState(""); // State for selected model
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	// Initialize queryClient
	const queryClient = useQueryClient();

	// Mutation for adding to cart
	const { mutate, isLoading: isAddingToCart } = useMutation({
		mutationKey: ["add-to-cart"],
		mutationFn: async (data) => {
			const session = await GetSession();
			const accessToken = session?.user?.accessToken;

			if (!accessToken) {
				throw new Error("Please sign in to add items to cart");
			}

			if (!data.productId || !data.color || !data.model) {
				throw new Error("Please select a color and model");
			}
			const res = await axios.post(`${API_URL}/cart/add`, data, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (res.status !== 201) {
				toast.error("Failed to add to cart");
			}
			return res.data;
		},
		onSuccess: () => {
			toast.success("Item added to cart");
			// Invalidate the cartItems query to trigger a refetch
			queryClient.invalidateQueries(["cartItems"]);
		},
		onError: (error) => {
			const message =
				error?.response?.data?.message ||
				error.message ||
				"Failed to update cart";
			toast.error(message);
		},
	});

	// Handler for incrementing quantity
	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	// Handler for decrementing quantity
	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	// Fetch product data
	const { data, isLoading, error } = useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			try {
				const res = await axios.get(`${API_URL}/product/${id}`);
				return res.data; // Ensure you return `res.data`, not `res`
			} catch (error) {
				throw new Error("Failed to fetch product");
			}
		},
		cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
		enabled: !!id, // Only fetch if id is available
		staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
	});

	if (isLoading) return <Loader />; // Show loading state
	if (!data) return <div>No product found</div>;
	if (error) return <div>Error: {error.message}</div>;

	const product = data.data || data;

	// Calculate discounted price
	const discountedPrice =
		product.price - (product.price * product.discount) / 100;

	// Format prices
	const formattedPrice = formatPrice(product.price);
	const formattedDiscountedPrice = formatPrice(discountedPrice);

	return (
			<main className="md:py-10 p-2">
				<Wrapper>
					<BreadcrumbComponent />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
						<div className="col-span-1">
							<ImageCarousel images={product.image} />
						</div>
						<div className="col-span-1 p-2 flex flex-col gap-5">
							<h1 className="text-header font-bold capitalize">
								{product.itemName}
							</h1>
							<div className="flex flex-col gap-5">
								{product.discount ? (
									<div className="flex items-center space-x-2">
										{/* Discounted Price */}
										<p className="font-medium text-normalText text-[#ffa476]">
											{formattedDiscountedPrice}
										</p>
										{/* Original Price with Line-Through */}
										<span className="text-normalText font-medium text-[#a8a9a8] line-through">
											{formattedPrice}
										</span>
									</div>
								) : (
									// Original Price (No Discount)
									<div className="flex items-center space-x-2">
										<p className="font-medium text-normalText text-[#ffa476]">
											{formattedPrice}
										</p>
									</div>
								)}

								<div>
									<ColorSelect
										colors={product.colors}
										value={color}
										onChange={setColor}
										title="Colors"
									/>
								</div>
							</div>
							<div>
								<span className="text-normalText text-[#a8a9a8]">
									Select Model:
								</span>
								<div>
									<SelectPhoneModel
										itemModel={product.itemModel}
										value={selectedModel}
										onChange={setSelectedModel}
										title="Select Model"
									/>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-normalText text-[#a8a9a8]">
									Quantity:
								</span>
								<div className="flex items-center border border-gray-300 rounded-md">
									<button
										onClick={decrementQuantity}
										className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md"
									>
										-
									</button>
									<span className="px-4 py-1 text-lg text-gray-800">
										{quantity}
									</span>
									<button
										onClick={incrementQuantity}
										className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md"
									>
										+
									</button>
								</div>
							</div>
							<div className="w-full md:mt-10 mt-5">
								<button
									onClick={() =>
										mutate({
											productId: id,
											quantity,
											color,
											model: selectedModel,
										})
									}
									disabled={isAddingToCart}
									className="bg-black text-white hover:bg-[#f4340d] active:scale-95 px-4 py-3 rounded-sm w-full cursor-pointer transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
								</button>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
						<div className="col-span-1 p-2">
							<TabComponent
								data={{
									description: product.description,
									details: product.details,
									materials: product.materials,
								}}
							/>
						</div>
						<div className="col-span-1">
							<p>Similar products</p>
						</div>
					</div>
				</Wrapper>
			</main>
	);
}
