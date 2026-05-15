"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import { apiGetItems } from "@api/rest/directus/items";
import { InputSearch, Skeleton } from "@components/shared/atoms";
import { Button, Pagination } from "@components/shared/molecules";
import { FilterItemConfig } from "@components/shared/molecules/FilterItem";
import { DataTable, Filter } from "@components/shared/organisms";
import { TableRow } from "@components/shared/organisms/DataTable";
import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout";
import { ColumnType, TableColumn } from "@type/component/table.type";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

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
	const fields = useAppStore((s) => s.fields);

	const currentCollection = collections.find((item) => item.collection === collection);
	const collectionLabel =
		currentCollection?.meta?.translations?.find((item) =>
			item.language.toLowerCase().includes(locale.toLowerCase())
		)?.translation || collection;

	// States
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [param, setParam] = useState<Record<string, any>>({});
	const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
	const [filters, setFilters] = useState<Record<string, FilterItemConfig>>({});

	const columns = useMemo<TableColumn<TableRow>[]>(() => {
		const normalizedLocale = locale.toLowerCase();
		const normalizeType = (type?: string) => (type ?? "").toLowerCase();

		/**
		 * Resolve column type based on Directus field type
		 * @param type string
		 */
		const resolveColumnType = (type?: string) => {
			switch (normalizeType(type)) {
				case "boolean":
					return ColumnType.BOOLEAN;
				case "integer":
				case "biginteger":
				case "float":
				case "decimal":
				case "numeric":
					return ColumnType.NUMBER;
				case "date":
					return ColumnType.DATE;
				case "datetime":
				case "timestamp":
					return ColumnType.DATETIME;
				case "time":
					return ColumnType.TIME;
				case "string":
				case "text":
				case "uuid":
				default:
					return ColumnType.TEXT;
			}
		};

		return fields
			.filter((item) => !item.collection.startsWith("directus_"))
			.filter((item) => item.collection === collection)
			.map((item) => {
				const label =
					(item?.meta?.translations instanceof Array ? item?.meta?.translations : []).find(
						(translation) => translation.language.toLowerCase().includes(normalizedLocale)
					)?.translation || item.field;

				return {
					key: item.field,
					label,
					dataType: resolveColumnType(item.type),
					isHidden: hiddenColumnKeys.includes(item.field),
					noTranslation: true,
				};
			});
	}, [collection, fields, hiddenColumnKeys, locale]);

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
	const handleGetDataTable = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await apiGetItems(collection, {
				page,
				limit: pageSize,
				...{ search },
				...param,
			});

			setDataTable(
				response.data.map((item, index) => ({
					id: (item as Record<string, unknown>).id ?? index,
					...item,
				}))
			);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [collection, page, pageSize, param, search]);

	/**
	 * Handle get total records
	 */
	const handleGetTotalRecords = useCallback(async () => {
		try {
			const response = await apiGetItems(collection, {
				["filter[status][_neq]"]: "archived",
				["aggregate[countDistinct]"]: "id",
			});
			const total = (response.data[0] as any).countDistinct.id ?? 0;
			setTotalItem(total);
		} catch (error) {
			console.log(error);
		}
	}, [collection]);

	useEffect(() => {
		console.log("Search:", search);
	}, [search]);

	useEffect(() => {
		Promise.all([handleGetDataTable(), handleGetTotalRecords()]);
	}, [collection, page, pageSize, search, handleGetDataTable, handleGetTotalRecords]);

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
					<div className="mt-2 flex flex-col gap-2">
						{/* Area: Actions */}
						<div className="flex justify-between gap-2">
							{/* Area: Left Action */}
							<div className="flex gap-2">
								{/* Area: Input Search */}
								<InputSearch
									placeholder="keyword"
									minLength={5}
									value={search}
									onChange={setSearch}
									onSearch={handleGetDataTable}
								/>

								{/* Area: Filter */}
								<Filter param={param} filters={{}} onFilter={() => {}} onParamChange={setParam} />
							</div>

							{/* Area: Right Action */}
							<div className="flex gap-2">
								{/* Area: Add List */}
								<Button size="sm" onClick={() => {}}>
									Add field
								</Button>
							</div>
						</div>

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
