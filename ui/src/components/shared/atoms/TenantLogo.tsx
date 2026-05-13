import { LogoPitel } from "@/public/images";
import Image from "next/image";
import Link from "next/link";

export interface TenantLogoProps {
	src?: string;
}

/**
 * Tenant Logo Component
 * @props TenantLogoProps
 */
const TenantLogo = ({ src }: TenantLogoProps) => {
	return (
		<Link className="block" href="/dashboard">
			<Image
				priority
				src={src?.length ? src : LogoPitel}
				alt="Service Logo"
				width={40}
				height={40}
			/>
		</Link>
	);
};

export default TenantLogo;
