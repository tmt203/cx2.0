"use client";

import { useAppStore } from "@/src/lib/store/appStore";
import { apiDeleteItem, apiGetItems } from "@api/rest/directus/items.api";
import { Button, ConfirmModal, Pagination } from "@components/shared/molecules";
import { FilterItemConfig } from "@components/shared/molecules/FilterItem";
import { DataTable, Filter } from "@components/shared/organisms";
import { TableRow } from "@components/shared/organisms/DataTable";
import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout";
import { ColumnType, TableColumn } from "@type/component/table.type";
import { debounce } from "@utils/debounce";
import { PencilLine, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export interface CollectionPageProps {
	collection: string;
}

/**
 * Collection Page
 * @param collection string
 * @param recordId string | undefined
 */
const CollectionPage = ({ collection }: CollectionPageProps) => {
	// Hooks
	const locale = useLocale();
	const t = useTranslations();
	const router = useRouter();
	const pathname = usePathname();
	const fields = useAppStore((state) => state.fields);
	const collections = useAppStore((state) => state.collections);

	// States
	const [page, setPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [pageSize, setPageSize] = useState<number>(20);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataTable, setDataTable] = useState<TableRow[]>([]);
	const [param, setParam] = useState<Record<string, any>>({});
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
	const [selectedRecord, setSelectedRecord] = useState<Record<string, unknown>>();
	const [filters, setFilters] = useState<Record<string, FilterItemConfig>>({});

	const collectionFields = useMemo(
		() => fields.filter((field) => field.collection === collection),
		[collection, fields]
	);
	const currentCollection = useMemo(
		() => collections.find((col) => col.collection === collection),
		[collection, collections]
	);
	const collectionLabel = useMemo(() => {
		const normalizedLocale = locale.toLowerCase();
		const translations = currentCollection?.meta?.translations;
		const matched = (translations instanceof Array ? translations : []).find((entry) =>
			entry.language.toLowerCase().includes(normalizedLocale)
		);
		return (
			matched?.translation ||
			(currentCollection?.meta as Record<string, unknown>)?.collection ||
			collection
		);
	}, [collection, currentCollection, locale]);
	const columns = useMemo<TableColumn<TableRow>[]>(() => {
		const normalizedLocale = locale.toLowerCase();
		const normalizeType = (type?: string) => (type ?? "").toLowerCase();

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

		return [...collectionFields]
			.sort((a, b) => Number(a.meta?.order) - Number(b.meta?.order))
			.map((item) => {
				const translation =
					(item?.meta?.translations instanceof Array ? item.meta.translations : []).find((entry) =>
						entry.language.toLowerCase().includes(normalizedLocale)
					)?.translation || item.field;

				return {
					key: item.field,
					label: translation,
					dataType: resolveColumnType(item.type),
					isHidden: Boolean(item.meta?.hidden) || hiddenColumnKeys.includes(item.field),
					noTranslation: true,
				};
			});
	}, [collectionFields, hiddenColumnKeys, locale]);

	/**
	 * Handle add record
	 */
	const handleAddRecord = useCallback(() => {
		router.push(`${pathname}/new`);
	}, [pathname, router]);

	/**
	 * Handle edit record modal open
	 * @param row TableRow
	 */
	const handleEditRecordModalOpen = useCallback(
		(row: TableRow) => {
			router.push(`${pathname}/${row.id as string | number}`);
		},
		[pathname, router]
	);

	/**
	 * Handle open delete modal
	 * @param row TableRow
	 */
	const handleOpenDeleteModal = useCallback((row: TableRow) => {
		setSelectedRecord(row);
		setDeleteModal(true);
	}, []);

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
	 * Handle get total records
	 */
	const handleGetTotalRecords = useCallback(async () => {
		try {
			const response = await apiGetItems(collection, {
				["aggregate[countDistinct]"]: "id",
			});
			if (!response.data || response.data.length === 0) {
				setTotalItem(0);
				return;
			}
			const total = (response.data[0] as any).countDistinct.id ?? 0;
			setTotalItem(total);
		} catch (error) {
			console.log(error);
		}
	}, [collection]);

	/**
	 * Handle get data table
	 */
	const handleGetDataTable = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await apiGetItems(collection, {
				page,
				limit: pageSize,
				sort: "-date_created",
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
	 * Handle delete selected record
	 */
	const handleDeleteSelectedRecord = useCallback(async () => {
		if (!selectedRecord) return;
		try {
			const recordId = selectedRecord.id as string | number | undefined;
			if (recordId === undefined || recordId === null) return;
			await apiDeleteItem(collection, recordId);
			setDeleteModal(false);
			setSelectedRecord(undefined);
			await handleGetTotalRecords();
			await handleGetDataTable();

			toast.success(
				t("api.delete.success", {
					data: t("common_data.record").toLowerCase(),
				})
			);
		} catch (error) {
			toast.error(
				t("api.delete.failed", {
					data: t("common_data.record").toLowerCase(),
				})
			);
			console.log(error);
		}
	}, [collection, handleGetDataTable, handleGetTotalRecords, selectedRecord]);

	/**
	 * Debounced search
	 */
	const debouncedSearch = useMemo(
		() => debounce(() => handleGetDataTable(), 500),
		[handleGetDataTable]
	);

	// Handle search by keyword
	useEffect(() => {
		if (search.length > 0 && search.length < 5) return;
		debouncedSearch();
	}, [search, debouncedSearch]);

	// Handle get total records
	useEffect(() => {
		handleGetTotalRecords();
	}, [handleGetTotalRecords]);

	return (
		<DefaultPageLayout
			breadcrumbs={[
				{
					key: "data_models",
					label: "Data Models",
					noTranslate: true,
				},
				{
					key: collection,
					label: `${collectionLabel}`,
					noTranslate: true,
				},
			]}
		>
			<div className="mt-2 flex flex-col gap-2">
				{/* Area: Actions */}
				<div className="flex justify-between gap-2">
					{/* Area: Left Action */}
					<div className="flex gap-2">
						{/* Area: Input Search */}
						{/* <InputSearch
							placeholder="keyword"
							minLength={5}
							value={search}
							onChange={setSearch}
							onSearch={handleGetDataTable}
						/> */}

						{/* Area: Filter */}
						<Filter param={param} filters={{}} onFilter={() => {}} onParamChange={setParam} />
					</div>

					{/* Area: Right Action */}
					<div className="flex gap-2">
						{/* Area: Add List */}
						<Button size="sm" onClick={handleAddRecord}>
							{t("action.add_record")}
						</Button>
					</div>
				</div>

				{/* Area: Table */}
				{columns.length > 0 && (
					<DataTable
						id="collection-data-table"
						showAction
						data={dataTable}
						showActionColumn
						columns={columns}
						currentPage={page}
						pageSize={pageSize}
						totalItem={totalItem}
						isLoading={isLoading}
						actionColumnOptions={[
							{
								label: "form.edit",
								icon: <PencilLine size={16} />,
								className: "text-primary-500",
								onClick: handleEditRecordModalOpen,
							},
							{
								label: "form.delete",
								icon: <Trash2 size={16} />,
								className: "text-danger-500",
								onClick: handleOpenDeleteModal,
							},
						]}
						onHideColumn={handleHideColumn}
					/>
				)}

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

			{deleteModal && (
				<ConfirmModal
					state="danger"
					title={t("action.confirm_delete")}
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					confirmLabel={t("form.delete")}
					onConfirm={handleDeleteSelectedRecord}
				>
					{t("action.confirm_delete_description")}
				</ConfirmModal>
			)}
		</DefaultPageLayout>
	);
};

export default CollectionPage;
