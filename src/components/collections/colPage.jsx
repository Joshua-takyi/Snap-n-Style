"use client";
import { Suspense, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BreadcrumbComponent } from "@/components/bread/bread";
import { ColSideBar } from "@/components/collections/side";
import Wrapper from "@/components/wrapper/wrapper";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/cards/card";
import axios from "axios";
import { ProductCardSkeleton } from "../skeleton/skeleton";

const categoryContent = {
	case: {
		title: "Phone Cases",
		description:
			"Discover our range of ergonomic, soft-touch cases crafted exclusively for your iPhone. The perfect balance of fashion and function. Available for iPhone 13, iPhone 14 and iPhone 15 Series. Optional with MagSafe.",
	},
	"airpod-cases": {
		title: "AirPods Cases",
		description:
			"Protect your AirPods in style with our premium protective cases. Designed for both AirPods and AirPods Pro, our cases offer the perfect blend of protection and aesthetics.",
	},
	"watch-straps": {
		title: "Watch straps",
		description:
			"Elevate your smartwatch with our collection of premium watch bands. Compatible with all series of Apple Watch and Samsung Galaxy Watch, offering comfort and style for every occasion.",
	},
};

const formatCategory = (id) =>
	categoryContent[id]?.title ||
	id
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const getSidebarCategory = (id) => {
	const categoryMap = {
		case: "Phone Cases",
		"airpod-cases": "AirPod Cases",
		"watch-bands": "Watch Bands",
	};
	return categoryMap[id] || "Phone Cases";
};

const CollectionContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const category = searchParams.get("category") || "";
	const sortBy = searchParams.get("sortBy") || "";
	const sortOrder = searchParams.get("sortOrder") || "";
	const limit = parseInt(searchParams.get("limit") || "15", 10);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const model = searchParams.get("model");
	const tags = searchParams.get("tags") || "";

	// Parse model from URL when component mounts or URL changes
	useEffect(() => {
		if (model) {
			try {
				const parsedModel = JSON.parse(model);
				setSelectedFilters(parsedModel);
			} catch (e) {
				console.error("Error parsing model:", e);
				setSelectedFilters([]);
			}
		} else {
			setSelectedFilters([]);
		}
	}, [model]);
	useEffect(() => {
		if (tags) {
			try {
				// Try parsing as JSON first
				const parsedTags = JSON.parse(tags);
				setSelectedTags(Array.isArray(parsedTags) ? parsedTags : [tags]);
			} catch (e) {
				// If JSON parsing fails, treat as a single tag
				setSelectedTags([tags]);
			}
		} else {
			setSelectedTags([]);
		}
	}, [tags]);

	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const { data, isLoading } = useQuery({
		queryKey: [
			"colData",
			category,
			sortBy,
			sortOrder,
			limit,
			page,
			selectedFilters,
			selectedTags,
		],
		queryFn: async () => {
			const res = await axios.get(
				`${API_URL}/product?category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}&page=${page}&model=${JSON.stringify(
					selectedFilters
				)}&tags=${tags}`
			);
			if (res.status !== 200) {
				throw new Error("Failed to fetch data");
			}
			return res.data;
		},
		cacheTime: 1000 * 60 * 5,
		staleTime: 1000 * 60 * 5,
		enabled: !!category,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	const handlePageChange = (newPage) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		currentParams.set("page", newPage.toString());
		router.push(`?${currentParams.toString()}`);
	};

	const handleFilterChange = (filters) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		if (filters.length > 0) {
			currentParams.set("model", JSON.stringify(filters));
		} else {
			currentParams.delete("model");
		}
		router.push(`?${currentParams.toString()}`, { scroll: false });
	};

	const renderProducts = (isLoading, data) => {
		if (isLoading) {
			return [...Array(limit)].map((_, idx) => (
				<ProductCardSkeleton key={idx} />
			));
		}

		if (!data?.data.length) {
			return (
				<div className="text-red-400 text-center col-span-full py-8">
					No products found matching your filters
				</div>
			);
		}

		return data.data.map((item) => (
			<ProductCard
				key={item._id}
				image={item.image[0]}
				images={item.image}
				name={item.itemName}
				color={item.color}
				id={item._id}
				discount={item.discount}
				price={item.price}
				category={item.category}
			/>
		));
	};

	return (
		<main className="min-h-screen  p-3 md:p-2">
			<Wrapper>
				<BreadcrumbComponent />
				<div>
					<Head
						headers={formatCategory(category || "case")}
						description={categoryContent[category || "case"]?.description}
					/>

					<div className="flex flex-col md:flex-row gap-2 sticky top-0">
						<div className="w-full md:w-1/4">
							<ColSideBar
								category={getSidebarCategory(category || "case")}
								onFilterChange={handleFilterChange}
							/>
						</div>
						<div className="w-full md:w-3/4">
							{/* Product Grid */}
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{renderProducts(isLoading, data)}
							</div>

							{/* Pagination Controls */}
							{data?.pagination && (
								<div className="flex gap-2 justify-center items-center mt-8">
									<button
										onClick={() => handlePageChange(page - 1)}
										disabled={page === 1}
										className="px-6 py-2.5 border border-gray-200 text-sm font-medium
                     hover:bg-gray-50 transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                     focus:outline-none focus:ring-2 focus:ring-gray-200"
										aria-label="Previous page"
									>
										Previous
									</button>
									<span className="px-4 py-2">
										Page {page} of {data.pagination.totalPages}
									</span>
									<button
										onClick={() => handlePageChange(page + 1)}
										disabled={page === data.pagination.totalPages}
										className="px-6 py-2.5 border border-gray-200 text-sm font-medium
                     hover:bg-gray-50 transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                     focus:outline-none focus:ring-2 focus:ring-gray-200"
										aria-label="Next page"
									>
										Next
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</Wrapper>
		</main>
	);
};

export default function Collection() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CollectionContent />
		</Suspense>
	);
}

const Head = ({ headers, description }) => (
	<div className="flex flex-col gap-4 md:py-6 mb-8">
		<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-[#011627]">
			{headers}
		</h1>
		<div className="text-gray-600">
			<p className="text-pretty w-full max-w-4xl text-sm md:text-base">
				{description}
			</p>
		</div>
	</div>
);

Head.propTypes = {
	headers: PropTypes.string.isRequired,
	description: PropTypes.string,
};
