export const ProductCardSkeleton = () => {
	return (
		<div className="flex flex-col space-y-3 rounded-lg overflow-hidden bg-white p-3 shadow-sm animate-pulse">
			{/* Image skeleton */}
			<div className="relative w-full pt-[100%] bg-gray-200 rounded-lg overflow-hidden">
				{/* Optional badge position */}
				<div className="absolute top-2 left-2 w-12 h-6 bg-gray-300 rounded" />
			</div>

			{/* Product name skeleton */}
			<div className="space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
				<div className="h-4 bg-gray-200 rounded w-1/2" />
			</div>

			{/* Price and color variant skeleton */}
			<div className="flex justify-between items-center mt-2">
				<div className="h-5 bg-gray-200 rounded w-20" />
				<div className="flex space-x-1">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="w-4 h-4 rounded-full bg-gray-200" />
					))}
				</div>
			</div>
		</div>
	);
};
