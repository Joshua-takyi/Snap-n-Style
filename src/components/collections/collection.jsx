"use client";
import { useRouter } from "next/navigation";
import Carousel from "../carousel/caro";
import Wrapper from "../wrapper/wrapper";
import Image from "next/image";

export const Collection = () => {
	const router = useRouter();

	const handleClick = (e, category) => {
		e.preventDefault();
		router.push(
			`/collection?category=${category}&sortBy=price&sortOrder=desc&limit=10&page=1`
		);
	};

	return (
		<section className="bg-[#f6f6f6] py-8 p-1">
			<Wrapper>
				<Carousel className="gap-5">
					{CollectionItems.map((item) => (
						<div
							onClick={(e) => handleClick(e, item.search)}
							key={item.id}
							className="flex flex-col justify-center items-center p-2 group cursor-pointer"
						>
							{/* Increase max-w-[180px] to max-w-[220px] for larger images */}
							<div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-full">
								<Image
									src={item.image}
									alt={item.name}
									fill
									sizes="(max-width: 640px) 120px,
                         (max-width: 1024px) 180px,
                         220px"
									className="object-cover hover:scale-105 transition-all duration-300 group-hover:scale-105"
								/>
							</div>
							<p className="mt-3 text-sm sm:text-base">{item.name}</p>
						</div>
					))}
				</Carousel>
			</Wrapper>
		</section>
	);
};

const CollectionItems = [
	{
		id: 1,
		name: "cases",
		search: "phone-cases",
		image: "/images/case.webp",
	},
	{
		id: 2,
		name: "airpod case",
		search: "airpod-cases",
		image: "/images/airpod.webp",
	},
	// {
	// 	id: 3,
	// 	name: "watch straps",
	// 	search: "watch-straps",
	// 	image: "/images/watch.webp",
	// },
	// {
	// 	id: 4,
	// 	name: "chargers",
	// 	search: "chargers",
	// 	image: "/images/charger.webp",
	// },
];
