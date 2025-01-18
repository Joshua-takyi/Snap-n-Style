"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import DropdownMenu from "../dropDown/dropdown";
import Wrapper from "../wrapper/wrapper";
import { Cart } from "../cart/cart";
import { AvatarComponent } from "../avartar/avatar";

export const Nav = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeGroup, setActiveGroup] = useState(null);

	// Close mobile menu when screen size changes to desktop
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false);
				setActiveGroup(null);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		setActiveGroup(null);
	};

	const toggleGroup = (id) => {
		setActiveGroup(activeGroup === id ? null : id);
	};

	return (
		<nav className="sticky top-0 shadow-sm z-[9999] bg-white  px-2 md:px-0">
			<Wrapper>
				<div className="flex items-center justify-between py-4">
					{/* Mobile Menu Button */}
					<button
						onClick={toggleMobileMenu}
						className="md:hidden p-2"
						aria-label="Toggle mobile menu"
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-4">
						<DropdownMenu header="Products" items={products} />
					</div>

					{/* Logo */}
					<header className="font-gotham_thin text-xl md:text-2xl font-bold">
						<Link href="/">snap n&apos; style</Link>
					</header>

					{/* Cart */}
					<div className="flex items-center gap-2">
						<Cart />
						<AvatarComponent />
					</div>
				</div>

				{/* Mobile Menu */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
						isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="pb-4 divide-y divide-gray-100 text-normalText">
						{products.map((group) => (
							<div key={group.id} className="py-2">
								<button
									onClick={() => toggleGroup(group.id)}
									className="flex items-center justify-between w-full p-2 text-left transition-all duration-100 ease-in-out"
								>
									<span className="font-medium">{group.header}</span>
									{activeGroup === group.id ? (
										<ChevronUp className="h-5 w-5" />
									) : (
										<ChevronDown className="h-5 w-5" />
									)}
								</button>
								<div
									className={`overflow-hidden transition-all duration-200 ${
										activeGroup === group.id ? "max-h-96" : "max-h-0"
									}`}
								>
									<div className="pl-4 py-2 space-y-2">
										{group.items.map((item, index) => (
											<Link
												key={index}
												href={item.href}
												className="block p-2 hover:bg-gray-50"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												{item.name}
											</Link>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</Wrapper>
		</nav>
	);
};

export default Nav;
// Grouped items
const products = [
	{
		id: 1,
		header: "Phone Cases",
		items: [
			{
				name: "iPhone Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tags=iphone-cases",
			},
			{
				name: "Galaxy Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tags=galaxy-cases",
			},
			{
				name: "OnePlus Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tag=oneplus-cases",
			},
			{
				name: "Pixel Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tag=pixel-cases",
			},
			{
				name: "Clear Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tag=clear-cases",
			},
			{
				name: "Leather Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tag=leather-cases",
			},
			{
				name: "Rugged Cases",
				href: "/collection?category=phone-cases&sortBy=price&sortOrder=desc&limit=50&page=1&tag=rugged-cases",
			},
		],
	},
	{
		id: 2,
		header: "Screen Protectors",
		items: [
			{ name: "Tempered Glass", href: "/tempered-glass" },
			{ name: "Privacy Screen Protectors", href: "/privacy-screen-protectors" },
			{ name: "Anti-Glare Protectors", href: "/anti-glare-protectors" },
			{ name: "Self-Healing Protectors", href: "/self-healing-protectors" },
		],
	},
	{
		id: 3,
		header: "Chargers & Cables",
		items: [
			{ name: "Fast Chargers", href: "/fast-chargers" },
			{ name: "Wireless Chargers", href: "/wireless-chargers" },
			{ name: "USB-C Cables", href: "/usb-c-cables" },
			{ name: "Lightning Cables", href: "/lightning-cables" },
			{ name: "Car Chargers", href: "/car-chargers" },
			{ name: "Multi-Port Chargers", href: "/multi-port-chargers" },
		],
	},
	{
		id: 4,
		header: "Earphones & Headphones",
		items: [
			{ name: "AirPods", href: "/airpods" },
			{ name: "Galaxy Buds", href: "/galaxy-buds" },
			{ name: "Wireless Earbuds", href: "/wireless-earbuds" },
			{
				name: "Noise-Cancelling Headphones",
				href: "/noise-cancelling-headphones",
			},
			{ name: "Sports Earphones", href: "/sports-earphones" },
		],
	},
	{
		id: 5,
		header: "Power Banks",
		items: [
			{ name: "20,000mAh Power Banks", href: "/20000mah-power-banks" },
			{ name: "10,000mAh Power Banks", href: "/10000mah-power-banks" },
			{ name: "Slim Power Banks", href: "/slim-power-banks" },
			{ name: "Solar Power Banks", href: "/solar-power-banks" },
		],
	},
	{
		id: 6,
		header: "Smartwatch Accessories",
		items: [
			{ name: "Apple Watch Bands", href: "/apple-watch-bands" },
			{ name: "Galaxy Watch Bands", href: "/galaxy-watch-bands" },
			{ name: "Charging Docks", href: "/charging-docks" },
			{ name: "Screen Protectors", href: "/smartwatch-screen-protectors" },
		],
	},
];
