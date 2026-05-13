"use client";

import { Button, InputForm } from "@components/shared/molecules";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { object, string } from "yup";

type LoginBody = {
	username: string;
	password: string;
};

export interface SignInFormProps {
	onSubmit?: (body: LoginBody) => Promise<void>;
}

/**
 * Sign In Form Component
 * @props SignInFormProps
 */
const SignInForm = ({ onSubmit }: SignInFormProps) => {
	// Hooks
	const t = useTranslations();
	const { width = 0 } = useWindowSize();

	const initialValues = useMemo(() => {
		return {
			email: "",
			password: "",
		};
	}, []);

	const validationSchema = object({
		email: string().required("error_message.required").email("error_message.invalid_email"),

		password: string().required("error_message.required"),
		// .test("password-requirements", "error_message.strong_password_required", (value) => {
		// 	if (!value) return false;
		// 	const requirements = getPasswordRequirements(value);
		// 	return requirements.every((req) => req.isValid);
		// }),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			const body: LoginBody = {
				username: values.email,
				password: values.password,
			};

			await onSubmit?.(body);
		},
	});

	return (
		<form
			noValidate
			className="flex h-fit w-full flex-col justify-start"
			onSubmit={formik.handleSubmit}
		>
			{/* Area: Email */}
			<InputForm
				required
				id="email"
				name="email"
				type="email"
				variant="v2"
				label="auth.sign_up.email"
				placeholder="admin@pitel.vn"
				size={width < 768 ? "sm" : "md"}
				className="min-h-[68px]"
				value={formik.values.email}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				state={formik.touched.email && formik.errors.email ? "error" : "default"}
				errorMessage={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
			/>

			{/* Area: Password */}
			<div className="flex flex-col">
				<InputForm
					required
					variant="v2"
					id="password"
					name="password"
					type="password"
					label="auth.sign_up.password"
					placeholder="********"
					size={width < 768 ? "sm" : "md"}
					className="min-h-[56px]"
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					state={formik.touched.password && formik.errors.password ? "error" : "default"}
					errorMessage={
						formik.touched.password && formik.errors.password ? formik.errors.password : ""
					}
				/>
				<Link href="#" className="self-end text-xs text-info-500 lg:text-base">
					{t("auth.sign_in.forgot_password")}
				</Link>
			</div>

			{/* Area: Submit Button */}
			<Button
				variant="secondary"
				size={width < 768 ? "sm" : "lg"}
				rounded="full"
				className="mx-auto my-8 w-10/12 lg:my-4 xl:my-8"
				disabled={!formik.dirty || formik.isSubmitting}
				state={formik.isSubmitting ? "loading" : "default"}
				type="submit"
			>
				{t("auth.tabs.sign_in")}
			</Button>
		</form>
	);
};

export default SignInForm;
