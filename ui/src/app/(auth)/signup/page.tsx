export const metadata = {
	title: "Sign Up - CX2.0",
	description: "Sign up for a new account on CX2.0 and start managing your collections with ease.",
};

import { AuthBg, LogoPitel } from "@/public/images";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
	return (
		<main className="bg-white dark:bg-gray-900">
			<div className="relative md:flex">
				{/* Content */}
				<div className="md:w-1/2">
					<div className="flex h-full min-h-[100dvh] flex-col after:flex-1">
						<div className="flex-1">
							<div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
								<Image priority src={LogoPitel} alt="Logo Pitel" width={100} />
							</div>
						</div>

						<div className="mx-auto w-full max-w-sm px-4 py-8">
							<h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100">
								Create your Account
							</h1>
							{/* Form */}
							<form>
								<div className="space-y-4">
									<div>
										<label className="mb-1 block text-sm font-medium" htmlFor="email">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input id="email" className="form-input w-full" type="email" />
									</div>
									<div>
										<label className="mb-1 block text-sm font-medium" htmlFor="name">
											Full Name <span className="text-red-500">*</span>
										</label>
										<input id="name" className="form-input w-full" type="text" />
									</div>
									<div>
										<label className="mb-1 block text-sm font-medium" htmlFor="role">
											Your Role <span className="text-red-500">*</span>
										</label>
										<select id="role" className="form-select w-full">
											<option>Designer</option>
											<option>Developer</option>
											<option>Accountant</option>
										</select>
									</div>
									<div>
										<label className="mb-1 block text-sm font-medium" htmlFor="password">
											Password
										</label>
										<input
											id="password"
											className="form-input w-full"
											type="password"
											autoComplete="on"
										/>
									</div>
								</div>
								<div className="mt-6 flex items-center justify-between">
									<div className="mr-1">
										<label className="flex items-center">
											<input type="checkbox" className="form-checkbox" />
											<span className="ml-2 text-sm">Email me about product news.</span>
										</label>
									</div>
									<Link
										className="btn ml-3 whitespace-nowrap bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
										href="/signup"
									>
										Sign Up
									</Link>
								</div>
							</form>
							{/* Footer */}
							<div className="mt-6 border-t border-gray-100 pt-5 dark:border-surface-400/30">
								<div className="text-sm">
									Have an account?{" "}
									<Link
										className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
										href="/signin"
									>
										Sign In
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className="absolute bottom-0 right-0 top-0 hidden md:block md:w-1/2"
					aria-hidden="true"
				>
					<Image
						className="h-full w-full object-cover object-center"
						src={AuthBg}
						priority
						width={760}
						height={1024}
						alt="Authentication"
					/>
				</div>
			</div>
		</main>
	);
}
