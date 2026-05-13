import NotFoundImageDark from "@/public/images/404-illustration-dark.svg";
import NotFoundImage from "@/public/images/404-illustration.svg";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
	return (
		<div className="flex h-[100dvh] overflow-hidden">
			{/* Content area */}
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
				<main className="grow [&>*:first-child]:scroll-mt-16">
					<div className="relative flex h-full items-center bg-white dark:bg-gray-900">
						<div className="w-full px-4 py-8 sm:px-6 lg:px-8">
							<div className="m-auto max-w-2xl">
								<div className="px-4 text-center">
									<div className="mb-8 inline-flex">
										<Image
											className="dark:hidden"
											src={NotFoundImage}
											width={176}
											height={176}
											alt="404 illustration"
										/>
										<Image
											className="hidden dark:block"
											src={NotFoundImageDark}
											width={176}
											height={176}
											alt="404 illustration dark"
										/>
									</div>
									<div className="mb-6">
										Hmm...this page doesn't exist. Try searching for something else!
									</div>
									<Link
										href="/sns/dashboard"
										className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
									>
										Back To Dashboard
									</Link>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default NotFound;
