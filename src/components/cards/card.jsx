"use client";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";

// Format price as currency
const formatPrice = (price, currency = "GHS") => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

export const ProductCard = ({
	name,
	color,
	price,
	image,
	discount,
	id,
	images,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	// Calculate discounted price
	const discountedPrice = price - (price * discount) / 100;

	// Format prices
	const formattedPrice = formatPrice(price);
	const formattedDiscountedPrice = formatPrice(discountedPrice);

	// Truncate long product names
	const formattedName = name.length > 25 ? `${name.substring(0, 25)}...` : name;

	return (
		<Link
			href={`/product/${id}`}
			className="group relative w-full bg-transparent"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Image Container */}
			<div className="relative aspect-square w-full overflow-hidden bg-transparent rounded-lg">
				{/* Main Image */}
				<Image
					src={image}
					alt={`${name} - ${color}`}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					className={`object-cover object-center transition-opacity duration-300 ease-in-out ${
						isHovered ? "opacity-0" : "opacity-100"
					}`}
					priority={false}
				/>
				{/* Secondary Image (image[1]) */}
				{images && images.length > 1 && (
					<Image
						src={images[1]}
						alt={`${name} - ${color} - Alternate`}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
						className={`object-cover object-center transition-opacity duration-300 ease-in-out ${
							isHovered ? "opacity-100" : "opacity-0"
						}`}
						priority={false}
					/>
				)}
			</div>

			{/* Product Info */}
			<div className="mt-4 space-y-1">
				{/* Product Name */}
				<h3 className="text-sm font-medium text-gray-900 line-clamp-2">
					{formattedName}
				</h3>

				{/* Product Color */}
				<p className="text-sm text-gray-500 capitalize">{color}</p>

				{/* Price Section */}
				<div className="flex items-center gap-2">
					{discount > 0 ? (
						<>
							{/* Discounted Price */}
							<p className="text-sm font-medium text-gray-900">
								{formattedDiscountedPrice}
							</p>
							{/* Original Price with Line-Through */}
							<p className="text-sm text-gray-400 line-through">
								{formattedPrice}
							</p>
						</>
					) : (
						// Original Price (No Discount)
						<p className="text-sm font-medium text-gray-900">
							{formattedPrice}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};

// Prop types validation
ProductCard.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	image: PropTypes.string.isRequired,
	discount: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.string).isRequired,
};
