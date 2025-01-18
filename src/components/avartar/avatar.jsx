import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const AvatarComponent = ({ src, alt }) => {
	return (
		<Avatar>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>{alt?.charAt(0) || "A"}</AvatarFallback>
		</Avatar>
	);
};

AvatarComponent.defaultProps = {
	src: "",
	alt: "",
};
