"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { X, ShoppingCart, Plus, Minus, Trash } from "lucide-react";
import Loader from "@/app/loading";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const Cart = () => {
	const [isOpen, setIsOpen] = useState(false);

	const cartVariant = {
		hidden: { opacity: 0, x: "100%" },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.2, ease: "easeOut" },
		},
	};

	// Fetch cart items
	const {
		data: cartItems,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["cartItems"],
		queryFn: async () => {
			try {
				const res = await axios.get(`/api/cart/get`);
				if (res.status !== 200) throw new Error("Failed to fetch cart items");
				return res.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to fetch cart"
				);
			}
		},
		onSuccess: () => {
			refetch();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to fetch cart items");
		},
	});

	// Mutation for updating cart
	const { mutate: updateCart } = useMutation({
		mutationKey: ["updateCart"],
		mutationFn: async (data) => {
			const res = await axios.post(`${API_URL}/api/cart/update`, data);
			if (res.status !== 200) throw new Error("Failed to update cart");
			return res.data;
		},
		onSuccess: () => {
			toast.success("Cart updated successfully!");
			refetch(); // Refetch cart items after successful update
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update cart");
		},
	});

	// Mutation for removing item from cart
	const { mutate: removeFromCart } = useMutation({
		mutationKey: ["removeFromCart"],
		mutationFn: async (data) => {
			const res = await axios.delete(`/api/cart/delete`, {
				data: {
					productId: data.productId,
					color: data.color,
					model: data.model,
				},
			});
			if (res.status !== 200)
				throw new Error("Failed to remove item from cart");
			return res.data;
		},
		onSuccess: () => {
			toast.success("Item removed from cart!");
			refetch(); // Refetch cart items after successful removal
		},
		onError: (error) => {
			toast.error(error.message || "Failed to remove item from cart");
		},
	});

	// Format price in Ghana Cedis (GHS)
	const formatPrice = (price) => {
		return new Intl.NumberFormat("en-GH", {
			style: "currency",
			currency: "GHS",
		}).format(price);
	};

	// Handler for incrementing quantity
	const incrementQuantity = (productId) => {
		const item = cartItems?.data?.products.find(
			(item) => item.productId._id === productId
		);
		if (item) {
			updateCart({
				productId,
				quantity: item.quantity + 1,
			});
		}
	};

	// Handler for decrementing quantity
	const decrementQuantity = (productId) => {
		const item = cartItems?.data?.products.find(
			(item) => item.productId._id === productId
		);
		if (item && item.quantity > 1) {
			updateCart({
				productId,
				quantity: item.quantity - 1,
			});
		}
	};

	// Handler for removing item from cart
	const handleRemoveItem = (item) => {
		removeFromCart({
			productId: item.productId._id,
			color: item.color,
			model: item.model,
		});
	};

	const cartItemsData = cartItems?.data?.products || [];
	const hasItems = cartItemsData.length > 0;

	const calculateTotal = () => {
		return cartItemsData.reduce((total, item) => total + item.totalPrice, 0);
	};

	return (
		<>
			{/* Cart Icon */}
			<button
				onClick={() => setIsOpen(true)}
				className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
			>
				<ShoppingCart className="w-5 h-5 text-gray-700" />
				{hasItems && (
					<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
						{cartItemsData.length}
					</span>
				)}
			</button>

			{/* Backdrop */}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
				/>
			)}

			{/* Cart Panel */}
			<motion.div
				variants={cartVariant}
				initial="hidden"
				animate={isOpen ? "visible" : "hidden"}
				className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="font-medium">
						Shopping Cart ({cartItemsData.length})
					</h2>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Cart Items */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<Loader />
						</div>
					) : isError ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-500">
							<p>{error?.message || "Something went wrong"}</p>
						</div>
					) : hasItems ? (
						cartItemsData.map((item, index) => (
							<Link
								href={`/product/${item.productId._id}`}
								key={index}
								className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="relative w-20 h-20 rounded-md overflow-hidden bg-white">
									<Image
										src={item.productId.image[0]}
										alt={item.productId.itemName}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-sm truncate">
										{item.productId.itemName}
									</h3>
									<div className="mt-1 text-xs text-gray-500 space-y-1">
										<p>Model: {item.model}</p>
										<div className="flex items-center gap-2">
											<span>Color:</span>
											<span
												className="w-3 h-3 rounded-full border"
												style={{ backgroundColor: item.color }}
											/>
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<button
												onClick={() => decrementQuantity(item.productId._id)}
												className="p-1 hover:bg-gray-200 rounded"
											>
												<Minus className="w-3 h-3" />
											</button>
											<span className="text-sm">{item.quantity}</span>
											<button
												onClick={() => incrementQuantity(item.productId._id)}
												className="p-1 hover:bg-gray-200 rounded"
											>
												<Plus className="w-3 h-3" />
											</button>
										</div>
										<p className="font-medium">
											{formatPrice(item.totalPrice)}
										</p>
									</div>
								</div>
								<button
									onClick={() => handleRemoveItem(item)}
									className="p-1 hover:bg-gray-200 rounded"
								>
									<Trash className="w-4 h-4 text-red-500" />
								</button>
							</Link>
						))
					) : (
						<div className="flex flex-col items-center justify-center h-full text-gray-500">
							<ShoppingCart className="w-12 h-12 mb-2 stroke-1" />
							<p>Your cart is empty</p>
						</div>
					)}
				</div>

				{/* Footer */}
				{hasItems && !isLoading && (
					<div className="border-t p-4 space-y-4">
						<div className="flex items-center justify-between">
							<span className="font-medium">Total</span>
							<span className="font-medium">
								{formatPrice(calculateTotal())}
							</span>
						</div>
						<button className="w-full bg-black text-white py-3 rounded-lg hover:bg-[#f4340d] active:scale-95 transition-colors">
							Checkout
						</button>
					</div>
				)}
			</motion.div>
		</>
	);
};

export default Cart;
