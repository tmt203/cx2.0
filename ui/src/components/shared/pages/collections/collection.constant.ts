import { Chip } from "@components/shared/atoms";
import { TableRow } from "@components/shared/organisms/DataTable";
import { ColumnType, TableColumn } from "@type/component/table.type";

export const TABLE_COLLECTION_COLUMN: TableColumn<TableRow>[] = [
	{
		key: "phone_number",
		dataType: ColumnType.TEXT,
		label: "lead_page.phone_number",
	},
	{
		key: "status",
		dataType: ColumnType.ACTION,
		label: "lead_page.status",
		component: [
			{
				component: Chip,
				props: (row) => {
					const status = {
						new: "lead_page.lead_status.new",
						queue: "lead_page.lead_status.queue",
						cancel: "lead_page.lead_status.cancel",
						processing: "lead_page.lead_status.processing",
						done: "lead_page.lead_status.done",
						fail: "lead_page.lead_status.fail",
					};
					const color = {
						new: "primary",
						queue: "info",
						cancel: "danger",
						processing: "warning",
						done: "success",
						fail: "danger",
					};

					return {
						variant: color[row.status as keyof typeof color],
						label: status[row.status as keyof typeof status],
						size: "xs",
					};
				},
			},
		],
	},
	{
		key: "list_name",
		dataType: ColumnType.TEXT,
		label: "lead_page.list_name",
		dataFormat(row) {
			return row.relation_info?.list_name ?? "-";
		},
	},
	{
		key: "campaign_name",
		dataType: ColumnType.TEXT,
		label: "lead_page.campaign_name",
		dataFormat(row) {
			return row.relation_info?.campaign_name ?? "-";
		},
	},
	{
		key: "template_name",
		dataType: ColumnType.TEXT,
		label: "lead_page.template_name",
		dataFormat(row) {
			return row.relation_info?.template_name ?? "-";
		},
	},
	{
		key: "oa_name",
		dataType: ColumnType.TEXT,
		label: "lead_page.oa_name",
		dataFormat(row) {
			return row.relation_info?.template_type ?? "-";
		},
	},
];