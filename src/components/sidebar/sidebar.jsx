import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
	{
		id: 1,
		name: "Dashboard",
		icon: "/images/menu.png",
		link: "/admin/dashboard",
	},
	{
		id: 2,
		name: "Products",
		icon: "/images/task.png",
		link: "/admin/products",
	},
	{
		id: 3,
		name: "Add Product",
		icon: "/images/add-post.png",
		link: "/admin/addTask",
	},
];
export const SideBar = () => {
	return (
		<aside className=" hidden md:block fixed top-0 left-0 h-screen w-64 border-r border-gray-200 p-5">
			<div className="flex flex-col gap-3">
				<Link href="/" className="p-2">
					<p className="font-semibold text-[1.4rem] animate-pulse">
						Snap n&apos; Style
					</p>
				</Link>
				<div className="flex flex-col gap-2">
					{sidebarItems.map((item) => (
						<Link href={item.link} key={item.id}>
							<div className="flex items-center gap-2 p-2">
								<Image src={item.icon} alt={item.name} width={20} height={20} />
								<p>{item.name}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</aside>
	);
};
