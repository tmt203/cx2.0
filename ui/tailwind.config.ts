import type { Config } from "tailwindcss";

const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: ["class", "class"],
	theme: {
		extend: {
			boxShadow: {
				sm: "0 1px 1px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.02)",
			},
			fontSize: {
				sm: ["0.75rem", { lineHeight: "1.5" }],
				base: ["0.875rem", { lineHeight: "1.5715" }],
				lg: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
				xl: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
				"2xl": ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
				"3xl": ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
				"4xl": ["1.88rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
				"5xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
				"6xl": ["3rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
				"7xl": ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
			},
			colors: {
				primary: {
					50: "hsl(var(--primary-50))",
					100: "hsl(var(--primary-100))",
					200: "hsl(var(--primary-200))",
					300: "hsl(var(--primary-300))",
					400: "hsl(var(--primary-400))",
					500: "hsl(var(--primary-500))",
					600: "hsl(var(--primary-600))",
					700: "hsl(var(--primary-700))",
					800: "hsl(var(--primary-800))",
					900: "hsl(var(--primary-900))",
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					50: "hsl(var(--secondary-50))",
					100: "hsl(var(--secondary-100))",
					200: "hsl(var(--secondary-200))",
					300: "hsl(var(--secondary-300))",
					400: "hsl(var(--secondary-400))",
					500: "hsl(var(--secondary-500))",
					600: "hsl(var(--secondary-600))",
					700: "hsl(var(--secondary-700))",
					800: "hsl(var(--secondary-800))",
					900: "hsl(var(--secondary-900))",
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				success: {
					50: "hsl(var(--success-50))",
					100: "hsl(var(--success-100))",
					200: "hsl(var(--success-200))",
					300: "hsl(var(--success-300))",
					400: "hsl(var(--success-400))",
					500: "hsl(var(--success-500))",
					600: "hsl(var(--success-600))",
					700: "hsl(var(--success-700))",
					800: "hsl(var(--success-800))",
					900: "hsl(var(--success-900))",
				},
				info: {
					50: "hsl(var(--info-50))",
					100: "hsl(var(--info-100))",
					200: "hsl(var(--info-200))",
					300: "hsl(var(--info-300))",
					400: "hsl(var(--info-400))",
					500: "hsl(var(--info-500))",
					600: "hsl(var(--info-600))",
					700: "hsl(var(--info-700))",
					800: "hsl(var(--info-800))",
					900: "hsl(var(--info-900))",
				},
				warning: {
					50: "hsl(var(--warning-50))",
					100: "hsl(var(--warning-100))",
					200: "hsl(var(--warning-200))",
					300: "hsl(var(--warning-300))",
					400: "hsl(var(--warning-400))",
					500: "hsl(var(--warning-500))",
					600: "hsl(var(--warning-600))",
					700: "hsl(var(--warning-700))",
					800: "hsl(var(--warning-800))",
					900: "hsl(var(--warning-900))",
				},
				danger: {
					50: "hsl(var(--danger-50))",
					100: "hsl(var(--danger-100))",
					200: "hsl(var(--danger-200))",
					300: "hsl(var(--danger-300))",
					400: "hsl(var(--danger-400))",
					500: "hsl(var(--danger-500))",
					600: "hsl(var(--danger-600))",
					700: "hsl(var(--danger-700))",
					800: "hsl(var(--danger-800))",
					900: "hsl(var(--danger-900))",
				},
				tertiary: {
					50: "hsl(var(--tertiary-50))",
					100: "hsl(var(--tertiary-100))",
					200: "hsl(var(--tertiary-200))",
					300: "hsl(var(--tertiary-300))",
					400: "hsl(var(--tertiary-400))",
					500: "hsl(var(--tertiary-500))",
					600: "hsl(var(--tertiary-600))",
					700: "hsl(var(--tertiary-700))",
					800: "hsl(var(--tertiary-800))",
					900: "hsl(var(--tertiary-900))",
				},
				surface: {
					50: "hsl(var(--surface-50))",
					100: "hsl(var(--surface-100))",
					200: "hsl(var(--surface-200))",
					300: "hsl(var(--surface-300))",
					400: "hsl(var(--surface-400))",
					500: "hsl(var(--surface-500))",
					600: "hsl(var(--surface-600))",
					700: "hsl(var(--surface-700))",
					800: "hsl(var(--surface-800))",
					900: "hsl(var(--surface-900))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("tailwindcss-animate"),

		// add custom scrollbar styles
		plugin(function ({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
			addUtilities({
				".scrollbar-hide": {
					"-ms-overflow-style": "none", // IE & Edge
					"scrollbar-width": "none", // Firefox
				},
				".scrollbar-hide::-webkit-scrollbar": {
					display: "none", // Chrome & Safari
				},
			});
		}),

		// add custom variant for expanding sidebar
		plugin(
			({
				addVariant,
				e,
			}: {
				addVariant: (name: string, callback: (args: any) => void) => void;
				e: (className: string) => string;
			}) => {
				addVariant("sidebar-expanded", ({ modifySelectors, separator }) => {
					modifySelectors(
						({ className }: { className: string }) =>
							".sidebar-expanded ." + e("sidebar-expanded" + separator + className)
					);
				});
			}
		),
	],
} satisfies Config;
