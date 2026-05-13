const tsParser = require("@typescript-eslint/parser");
const nextPlugin = require("@next/eslint-plugin-next");

// Enforce semantic design tokens by disallowing direct Tailwind color utilities
// such as text-red-500 or bg-blue-300 in app code.
const RAW_TW_COLOR_UTILITY_PATTERN =
	"(?:^|\\s)(?:[\\w-]+:)*(?:text|bg|border|fill|stroke|from|via|to)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\\s|$)";

module.exports = [
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			next: nextPlugin,
		},
		rules: {
			"next/no-img-element": "off",
			"no-restricted-syntax": [
				"error",
				{
					selector: `JSXAttribute[name.name='className'] > Literal[value=/${RAW_TW_COLOR_UTILITY_PATTERN}/]`,
					message:
						"Use semantic theme tokens instead of raw Tailwind colors (e.g. text-primary, bg-background).",
				},
				{
					selector: `JSXAttribute[name.name='className'] > JSXExpressionContainer > Literal[value=/${RAW_TW_COLOR_UTILITY_PATTERN}/]`,
					message:
						"Use semantic theme tokens instead of raw Tailwind colors (e.g. text-primary, bg-background).",
				},
				{
					selector: `JSXAttribute[name.name='className'] > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/${RAW_TW_COLOR_UTILITY_PATTERN}/]`,
					message:
						"Use semantic theme tokens instead of raw Tailwind colors (e.g. text-primary, bg-background).",
				},
				{
					selector: `CallExpression[callee.name=/^(cn|clsx|twMerge)$/] Literal[value=/${RAW_TW_COLOR_UTILITY_PATTERN}/]`,
					message:
						"Use semantic theme tokens instead of raw Tailwind colors inside cn/clsx/twMerge.",
				},
				{
					selector: `CallExpression[callee.name=/^(cn|clsx|twMerge)$/] TemplateLiteral > TemplateElement[value.raw=/${RAW_TW_COLOR_UTILITY_PATTERN}/]`,
					message:
						"Use semantic theme tokens instead of raw Tailwind colors inside cn/clsx/twMerge.",
				},
			],
		},
	},
];
