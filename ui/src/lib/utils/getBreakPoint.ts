import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfigFile from "../../../tailwind.config";

export const tailwindConfig = resolveConfig(tailwindConfigFile);

export const getBreakpointValue = (value: string): number => {
	const screenValue = (tailwindConfig.theme.screens as Record<string, string>)[value];
	return +screenValue.slice(0, screenValue.indexOf("px"));
};

export const getBreakpoint = (): string | undefined => {
	let currentBreakpoint: string | undefined;
	let biggestBreakpointValue = 0;
	let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
	for (const breakpoint of Object.keys(tailwindConfig.theme.screens)) {
		const breakpointValue = getBreakpointValue(breakpoint);
		if (breakpointValue > biggestBreakpointValue && windowWidth >= breakpointValue) {
			biggestBreakpointValue = breakpointValue;
			currentBreakpoint = breakpoint;
		}
	}
	return currentBreakpoint;
};
