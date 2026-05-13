import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Be_Vietnam_Pro } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../lib/css/style.css";
import AppThemeProvider from "./AppThemeProvider";

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata = {
	title: "CX 2.0",
	description: "CX 2.0 - The Ultimate Customer Experience Platform",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${beVietnamPro.variable}`} suppressHydrationWarning>
			<body className="font-inter bg-gray-100 text-gray-600 antialiased dark:bg-gray-900 dark:text-gray-400">
				<NextIntlClientProvider messages={messages}>
					<AppThemeProvider>
						<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
						{children}
					</AppThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
