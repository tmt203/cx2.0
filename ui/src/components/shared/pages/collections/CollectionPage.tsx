"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import { fetchCollectionFieldNames, fetchCollectionItems } from "@lib/api/graphql";
import { DataTable } from "@components/shared/organisms";
import { TableRow } from "@components/shared/organisms/DataTable";
import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout";
import { useLocale } from "next-intl";
import { ColumnType, TableColumn } from "@type/component/table.type";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Pagination } from "@components/shared/molecules";
import { Skeleton } from "@components/shared/atoms";
import { Input } from "@components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@components/ui/sheet";

export interface CollectionPageProps {
	collection: string;
	recordId?: string;
}

/**
 * Collection Page
 * @param collection string
 * @param recordId string | undefined
 */
const CollectionPage = ({ collection, recordId }: CollectionPageProps) => {
	const locale = useLocale();
	const collections = useAppStore((s) => s.collections);
	const currentCollection = collections.find((item) => item.collection === collection);
	const collectionLabel =
		currentCollection?.meta?.translations?.find((item) =>
			item.language.toLowerCase().includes(locale.toLowerCase())
		)?.translation || collection;

	// States
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [param, setParam] = useState<Record<string, any>>({});
	const [fieldNames, setFieldNames] = useState<string[]>([]);
	const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({});
	const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
	const [isAddFieldOpen, setIsAddFieldOpen] = useState<boolean>(false);
	const [isCreatingField, setIsCreatingField] = useState<boolean>(false);
	const [fieldError, setFieldError] = useState<string | null>(null);
	const [newField, setNewField] = useState({
		name: "",
		displayName: "",
		type: "string",
		required: false,
		defaultValue: "",
	});
	const inferColumnType = useCallback(
		(key: string): ColumnType => {
			const sampleValue = dataTable.find((row) => row[key] !== null && row[key] !== undefined)?.[
				key
			];

			if (typeof sampleValue === "boolean") {
				return ColumnType.BOOLEAN;
			}

			if (typeof sampleValue === "number") {
				return ColumnType.NUMBER;
			}

			return ColumnType.TEXT;
		},
		[dataTable]
	);
	const columns = useMemo<TableColumn<TableRow>[]>(() => {
		if (!dataTable.length) return [];
		return Object.keys(dataTable[0] || {}).map((key) => ({
			key,
			label: fieldLabels[key] || key,
			dataType: inferColumnType(key),
			isHidden: hiddenColumnKeys.includes(key),
			noTranslation: true,
		}));
	}, [dataTable, fieldLabels, hiddenColumnKeys, inferColumnType]);

	const fieldTypeOptions = useMemo(
		() => [
			{ label: "String", value: "string" },
			{ label: "Text", value: "text" },
			{ label: "Integer", value: "integer" },
			{ label: "Float", value: "float" },
			{ label: "Boolean", value: "boolean" },
			{ label: "Date", value: "date" },
			{ label: "Time", value: "time" },
			{ label: "Date time", value: "dateTime" },
			{ label: "JSON", value: "json" },
		],
		[]
	);

	/**
	 * Handle hide column
	 * @param columnKey string
	 */
	const handleHideColumn = useCallback((columnKey: string) => {
		setHiddenColumnKeys((prev) =>
			prev.includes(columnKey) ? prev.filter((key) => key !== columnKey) : [...prev, columnKey]
		);
	}, []);

	/**
	 * Handle get data table
	 */
	const handleGetDataTable = async () => {
		try {
			setIsLoading(true);
			const defaultFields = fieldNames.length ? fieldNames : ["id"];
			const fields = (param?.fields as string[] | undefined) ?? defaultFields;
			const { items, total } = await fetchCollectionItems<TableRow>({
				collection,
				fields,
				limit: pageSize,
				offset: (page - 1) * pageSize,
				sort: param?.sort as string[] | undefined,
				filter: param?.filter as Record<string, unknown> | undefined,
				fetchPolicy: "network-only",
			});

			const normalizeValue = (value: unknown): unknown => {
				if (Array.isArray(value)) {
					return value.map(normalizeValue).join(", ");
				}

				if (value && typeof value === "object") {
					if ("id" in value) {
						return (value as { id?: unknown }).id ?? "";
					}

					return JSON.stringify(value);
				}

				return value;
			};

			const normalizedItems = items.map((row) => {
				const normalizedEntries = Object.entries(row)
					.filter(([key]) => !key.startsWith("__"))
					.map(([key, value]) => [key, normalizeValue(value)]);
				return Object.fromEntries(normalizedEntries) as TableRow;
			});

			setDataTable(normalizedItems);
			setTotalItem(total);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const loadFields = useCallback(async () => {
		try {
			const response = await fetchCollectionFieldNames(collection, locale);
			const withId = response.fields.includes("id") ? response.fields : ["id", ...response.fields];
			setFieldNames(withId);
			setFieldLabels(response.labels);
		} catch (error) {
			console.log(error);
			setFieldNames(["id"]);
			setFieldLabels({});
		}
	}, [collection, locale]);

	/**
	 * Handle add new field on collection
	 */
	const handleAddNewField = () => {
		setFieldError(null);
		setIsAddFieldOpen(true);
	};

	const handleCreateField = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFieldError(null);
		setIsCreatingField(true);

		try {
			const response = await fetch(
				`/api/collections/fields?collection=${encodeURIComponent(collection)}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						field: newField.name.trim(),
						displayName: newField.displayName.trim() || undefined,
						type: newField.type,
						required: newField.required,
						defaultValue: newField.defaultValue,
					}),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to create field");
			}

			await loadFields();
			setPage(1);
			setIsAddFieldOpen(false);
			setNewField({
				name: "",
				displayName: "",
				type: "string",
				required: false,
				defaultValue: "",
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setFieldError(message);
		} finally {
			setIsCreatingField(false);
		}
	};

	useEffect(() => {
		loadFields();
	}, [loadFields]);

	useEffect(() => {
		if (!fieldNames.length) {
			return;
		}
		handleGetDataTable();
	}, [collection, page, pageSize, param, fieldNames]);

	return (
		<DefaultPageLayout
			breadcrumbs={[
				{
					key: "collections",
					label: "Collections",
					noTranslate: true,
				},
				{
					key: collection,
					label: collectionLabel,
					noTranslate: true,
				},
			]}
		>
			{isLoading ? (
				<div>
					<Skeleton shape="square" className="mb-4 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />

					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
					<Skeleton shape="square" className="mb-1 w-full" />
				</div>
			) : (
				<>
					<div className="mb-4 flex justify-between gap-2">
						<div className="flex gap-2"></div>

						{/* Area: Right Action */}
						{/* <div className="flex gap-2">
							<Button size="sm" onClick={() => {}}>
								Add new record
							</Button>
						</div> */}

						<div className="flex gap-2">
							<Button size="sm" onClick={handleAddNewField}>
								Add new field on collection
							</Button>
						</div>
					</div>

					<Sheet open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
						<SheetContent className="w-full bg-white text-slate-900 sm:max-w-lg">
							<SheetHeader>
								<SheetTitle>Add new field</SheetTitle>
								<SheetDescription>
									Create a new field for the {collection} collection.
								</SheetDescription>
							</SheetHeader>

							<form className="mt-6 space-y-4" onSubmit={handleCreateField}>
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Field name</label>
									<Input
										className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
										value={newField.name}
										onChange={(event) =>
											setNewField((prev) => ({ ...prev, name: event.target.value }))
										}
										placeholder="e.g. custom_code"
										required
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Display name</label>
									<Input
										className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
										value={newField.displayName}
										onChange={(event) =>
											setNewField((prev) => ({
												...prev,
												displayName: event.target.value,
											}))
										}
										placeholder="Optional label"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Field type</label>
									<select
										className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm"
										value={newField.type}
										onChange={(event) =>
											setNewField((prev) => ({ ...prev, type: event.target.value }))
										}
									>
										{fieldTypeOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700">Default value</label>
									<Input
										className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
										value={newField.defaultValue}
										onChange={(event) =>
											setNewField((prev) => ({
												...prev,
												defaultValue: event.target.value,
											}))
										}
										placeholder="Optional"
									/>
								</div>

								<label className="flex items-center gap-2 text-sm text-slate-700">
									<input
										type="checkbox"
										checked={newField.required}
										onChange={(event) =>
											setNewField((prev) => ({ ...prev, required: event.target.checked }))
										}
									/>
									Required
								</label>

								{fieldError && (
									<div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
										{fieldError}
									</div>
								)}

								<SheetFooter className="gap-2">
									<Button type="button" outline onClick={() => setIsAddFieldOpen(false)}>
										Cancel
									</Button>
									<Button type="submit" size="sm" state={isCreatingField ? "loading" : "default"}>
										Create field
									</Button>
								</SheetFooter>
							</form>
						</SheetContent>
					</Sheet>

					<div className="flex flex-col gap-4">
						{/* Area: Table */}
						<DataTable
							id="collection-data-table"
							showAction
							data={dataTable}
							showActionColumn
							currentPage={page}
							pageSize={pageSize}
							totalItem={totalItem}
							columns={columns}
							onHideColumn={handleHideColumn}
						/>

						{/* Area: Pagination */}
						{dataTable.length > 0 && (
							<Pagination
								currentPage={page}
								pageSize={pageSize}
								totalItem={totalItem}
								setPage={setPage}
								setPageSize={setPageSize}
							/>
						)}
					</div>
				</>
			)}
		</DefaultPageLayout>
	);
};

export default CollectionPage;
