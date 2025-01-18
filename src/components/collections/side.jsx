"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const ColSideBar = ({ category = "Phone Cases", onFilterChange }) => {
	const [openCategory, setOpenCategory] = useState(null);
	const [selectedModels, setSelectedModels] = useState([]);
	const [sidebarStyle, setSidebarStyle] = useState({});
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const sidebarRef = useRef(null);
	const searchParams = useSearchParams();

	const filterData = {
		"Phone Cases": {
			Apple: [
				"iPhone 14 Pro Max",
				"iPhone 14 Pro",
				"iPhone 14",
				"iPhone 13 Pro Max",
				"iPhone 13 Pro",
				"iPhone 13",
				"iPhone 12 Pro Max",
				"iPhone 12 Pro",
				"iPhone 12",
				"iPhone 11 Pro Max",
				"iPhone 11 Pro",
				"iPhone 11",
			],
			Samsung: [
				"Galaxy S23 Ultra",
				"Galaxy S23+",
				"Galaxy S23",
				"Galaxy Z Fold 4",
				"Galaxy Z Flip 4",
				"Galaxy A54 5G",
				"Galaxy A34 5G",
				"Galaxy A14 5G",
				"Galaxy A73 5G",
				"Galaxy A53 5G",
				"Galaxy A33 5G",
				"Galaxy A13",
				"Galaxy A04s",
				"Galaxy M53 5G",
				"Galaxy M33 5G",
				"Galaxy M13",
				"Galaxy F14 5G",
				"Galaxy F04",
			],
			Google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6a", "Pixel 6", "Pixel 5"],
			Infinix: [
				"Infinix Zero 30 5G",
				"Infinix Zero 20",
				"Infinix Note 30 VIP",
				"Infinix Note 30 Pro",
				"Infinix Note 30",
				"Infinix Hot 30",
				"Infinix Smart 8",
				"Infinix GT 10 Pro",
			],
			Tecno: [
				"Tecno Camon 20 Pro 5G",
				"Tecno Camon 20 Pro",
				"Tecno Camon 20",
				"Tecno Phantom V Fold",
				"Tecno Phantom X2 Pro",
				"Tecno Spark 10 Pro",
				"Tecno Spark 10",
				"Tecno Pova 5 Pro",
				"Tecno Pova 5",
			],
			Xiaomi: [
				"Xiaomi 13 Pro",
				"Xiaomi 13",
				"Xiaomi 12T Pro",
				"Xiaomi 12T",
				"Xiaomi Redmi Note 12 Pro+",
				"Xiaomi Redmi Note 12 Pro",
				"Xiaomi Redmi Note 12",
				"Xiaomi Redmi 12",
			],
			Oppo: [
				"Oppo Find X6 Pro",
				"Oppo Find X6",
				"Oppo Reno 10 Pro+",
				"Oppo Reno 10 Pro",
				"Oppo Reno 10",
				"Oppo A98 5G",
				"Oppo A78 5G",
				"Oppo A58",
			],
			Vivo: [
				"Vivo X90 Pro",
				"Vivo X90",
				"Vivo V29 Pro",
				"Vivo V29",
				"Vivo V27",
				"Vivo Y36",
				"Vivo Y27",
				"Vivo Y16",
			],
			Realme: [
				"Realme GT 3",
				"Realme GT Neo 5",
				"Realme 11 Pro+",
				"Realme 11 Pro",
				"Realme 11",
				"Realme Narzo 60 Pro",
				"Realme Narzo 60",
				"Realme C55",
			],
		},
		"AirPod Cases": {
			"AirPods Pro": ["AirPods Pro 2nd Gen", "AirPods Pro 1st Gen"],
			AirPods: ["AirPods 3rd Gen", "AirPods 2nd Gen", "AirPods 1st Gen"],
		},
		Chargers: {
			"Wall Chargers": [
				"20W USB-C Fast Charger",
				"30W USB-C Fast Charger",
				"65W GaN Charger",
			],
			"Car Chargers": [
				"12V USB-C Car Charger",
				"24W Dual Port Car Charger",
				"36W USB-C Car Charger",
			],
			"Wireless Chargers": [
				"10W Qi Wireless Charger",
				"15W MagSafe Charger",
				"20W Fast Wireless Charger",
			],
		},
		"Watch Straps": {
			"Apple Watch": [
				"Solo Loop",
				"Braided Solo Loop",
				"Sport Band",
				"Leather Link",
				"Milanese Loop",
			],
			"Samsung Watch": [
				"Elastic Sport Band",
				"Hybrid Leather Band",
				"Metal Link Bracelet",
				"Silicone Band",
			],
		},
		"Watch Protectors": {
			"Apple Watch": [
				"Series 8 (45mm) Tempered Glass",
				"Series 8 (41mm) Tempered Glass",
				"Series 7 (45mm) Tempered Glass",
				"Series 7 (41mm) Tempered Glass",
				"SE 2nd Gen Tempered Glass",
			],
			"Samsung Watch": [
				"Galaxy Watch 5 Pro Tempered Glass",
				"Galaxy Watch 5 Tempered Glass",
				"Galaxy Watch 4 Tempered Glass",
			],
		},
	};

	const normalizeCategory = (category) => {
		return category.replace(/-/g, " ");
	};

	const currentCategories = filterData[normalizeCategory(category)] || {};

	useEffect(() => {
		const handleScroll = () => {
			if (!sidebarRef.current || window.innerWidth < 768) return;

			const sidebar = sidebarRef.current;
			const sidebarRect = sidebar.getBoundingClientRect();
			const mainContent = document.querySelector(".grid"); // Grid of products

			if (!mainContent) return;

			const mainContentRect = mainContent.getBoundingClientRect();
			const mainContentBottom =
				mainContent.offsetTop + mainContent.offsetHeight;
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;

			// Get the parent container's top offset
			const parentTop = sidebar.parentElement.getBoundingClientRect().top;

			if (parentTop > 0) {
				// Reset position when scrolled to top
				setSidebarStyle({
					position: "relative",
					top: 0,
				});
			} else if (scrollY + windowHeight >= mainContentBottom) {
				// Stop at bottom of content
				setSidebarStyle({
					position: "absolute",
					top: mainContentBottom - sidebarRect.height,
				});
			} else {
				// Stick to top
				setSidebarStyle({
					position: "fixed",
					top: "0px",
					width: sidebarRef.current.offsetWidth + "px",
				});
			}
		};

		window.addEventListener("scroll", handleScroll);
		// Initial position check
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const model = searchParams.get("model");
		if (model) {
			try {
				const parsedModel = JSON.parse(model);
				setSelectedModels(parsedModel);
			} catch (e) {
				console.error("Error parsing model:", e);
				setSelectedModels([]);
			}
		} else {
			setSelectedModels([]);
		}
	}, [category, searchParams]);

	useEffect(() => {
		if (isMobileOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMobileOpen]);

	const handleCheckboxChange = (model) => {
		const normalizedModel = model.toLowerCase();
		const newSelectedModels = selectedModels.includes(normalizedModel)
			? selectedModels.filter((m) => m !== normalizedModel)
			: [...selectedModels, normalizedModel];

		setSelectedModels(newSelectedModels);
		onFilterChange(newSelectedModels);
	};

	const handleSelectAll = (subCategory) => {
		const subCategoryModels = currentCategories[subCategory].map((m) =>
			m.toLowerCase()
		);
		const allSelected = subCategoryModels.every((model) =>
			selectedModels.includes(model)
		);

		const newSelectedModels = allSelected
			? selectedModels.filter((model) => !subCategoryModels.includes(model))
			: [...new Set([...selectedModels, ...subCategoryModels])];

		setSelectedModels(newSelectedModels);
		onFilterChange(newSelectedModels);
	};

	const handleCloseMobile = () => {
		setIsMobileOpen(false);
		document.body.style.overflow = "auto";
	};

	const getFilterTitle = () => {
		switch (category.toLowerCase()) {
			case "phone-cases":
			case "cases":
				return "Phone Models";
			case "airpod-cases":
			case "airpods":
				return "AirPods Models";
			case "watch-straps":
				return "watch straps";
			case "chargers":
			case "charger":
				return "Charger Models";
			case "iwatch-protectors":
				return "iWatch Protectors";
			case "watch protector":
			case "watch-protector":
				return "Watch Protectors";
			default:
				return "Models";
		}
	};

	return (
		<>
			{/* Mobile Filter Button */}
			<button
				onClick={() => setIsMobileOpen(true)}
				className="fixed bottom-4 right-4 md:hidden z-30 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
			>
				<span>Filters</span>
				<span className="bg-blue-500 px-2 py-0.5 rounded-full text-sm">
					{selectedModels.length}
				</span>
			</button>

			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={handleCloseMobile}
				/>
			)}

			<aside
				ref={sidebarRef}
				style={sidebarStyle}
				className={`
          md:block z-50
          w-[280px] md:w-full max-w-xs
          bg-white transition-all duration-300 ease-in-out
          md:translate-x-0
          ${
						isMobileOpen
							? "fixed inset-y-0 right-0 translate-x-0"
							: "fixed inset-y-0 right-0 translate-x-full md:relative"
					}
        `}
			>
				<div className="flex flex-col h-full">
					{/* Mobile Header */}
					<div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100">
						<h2 className="text-lg font-medium">Filters</h2>
						<button
							onClick={handleCloseMobile}
							className="p-2 hover:bg-gray-100 rounded-full"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Desktop Header */}
					<h2 className="hidden md:block text-sm font-medium text-gray-500 px-4 py-3 uppercase tracking-wider border-b border-gray-100">
						{getFilterTitle()}
					</h2>

					{/* Filters Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="flex flex-col divide-y divide-gray-100">
							{Object.entries(currentCategories).map(
								([subCategory, models]) => (
									<div key={subCategory}>
										<div className="flex flex-col">
											<button
												onClick={() =>
													setOpenCategory(
														openCategory === subCategory ? null : subCategory
													)
												}
												className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
											>
												<div className="flex items-center justify-between w-full">
													<span className="font-medium text-gray-900">
														{subCategory}
													</span>
													<ChevronRight
														className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
															openCategory === subCategory ? "rotate-90" : ""
														}`}
													/>
												</div>
											</button>

											<div
												className={`transition-all duration-200 ease-in-out
                        ${openCategory === subCategory ? "block" : "hidden"}
                      `}
											>
												<div className="px-4 py-2 space-y-1">
													<button
														onClick={() => handleSelectAll(subCategory)}
														className="text-xs text-blue-600 hover:text-blue-700 mb-2"
													>
														Select All
													</button>
													<div className="space-y-1">
														{models.map((model) => (
															<label
																key={model}
																className="flex items-center py-1 cursor-pointer group"
															>
																<input
																	type="checkbox"
																	checked={selectedModels.includes(
																		model.toLowerCase()
																	)}
																	onChange={() => handleCheckboxChange(model)}
																	className="w-4 h-4 rounded border-gray-300 text-blue-500 
                                  focus:ring-1 focus:ring-blue-500 focus:ring-offset-0"
																/>
																<span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
																	{model}
																</span>
															</label>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							)}
						</div>
					</div>

					{/* Mobile Apply Button */}
					<div className="p-4 border-t border-gray-100 md:hidden">
						<button
							onClick={handleCloseMobile}
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Apply Filters
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};
