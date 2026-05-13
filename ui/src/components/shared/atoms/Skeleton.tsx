import { Size } from "@type/common.type";
import clsx from "clsx";

export interface SkeletonProps {
	shape?: "circle" | "line" | "square";
	size?: Exclude<Size, "2xs" | "xs" | "2xl" | "full">;
	className?: string;
}

const Skeleton = ({ shape = "line", className = "", size = "md" }: SkeletonProps) => {
	return (
		<div
			className={clsx("animate-pulse rounded bg-surface-300", className, {
				"!rounded-full": shape === "circle",
				"w-full": ["line", "rectangle"].includes(shape),
				"h-3": size === "sm" && shape === "line",
				"h-4": size === "md" && shape === "line",
				"h-6": size === "lg" && shape === "line",
				"h-8": size === "xl" && shape === "line",
				"h-8 w-8": size === "sm" && ["square", "circle"].includes(shape),
				"h-9 w-9": size === "md" && ["square", "circle"].includes(shape),
				"h-10 w-10": size === "lg" && ["square", "circle"].includes(shape),
				"h-16 w-16": size === "xl" && ["square", "circle"].includes(shape),
			})}
		/>
	);
};

export default Skeleton;
