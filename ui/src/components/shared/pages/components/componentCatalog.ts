export type ComponentGroupKey = "atoms" | "molecules" | "organisms";

export type ComponentGroup = {
	key: ComponentGroupKey;
	label: string;
};

export type ComponentItem = {
	key: string;
	name: string;
	description: string;
	group: ComponentGroupKey;
	usage: string;
	examples?: string[];
};

export type ComponentSidebarItem = {
	key: string;
	label: string;
	href: string;
};

export type ComponentSidebarGroup = {
	key: ComponentGroupKey;
	label: string;
	items: ComponentSidebarItem[];
};

export const componentGroups: ComponentGroup[] = [
	{ key: "atoms", label: "Atoms" },
	{ key: "molecules", label: "Molecules" },
	{ key: "organisms", label: "Organisms" },
];

export const componentCatalog: ComponentItem[] = [
	{
		key: "date-picker",
		name: "DatePicker",
		description: "Date-only picker with clear control and formatted output.",
		group: "atoms",
		usage: `import DatePicker from "@components/shared/atoms/DatePicker";

export default function Example() {
	return <DatePicker onSelectDate={(value) => console.log(value)} />;
}`,
		examples: [
			`import DatePicker from "@components/shared/atoms/DatePicker";

export default function Basic() {
	return <DatePicker onSelectDate={(value) => console.log("Selected:", value)} />;
}`,
			`import DatePicker from "@components/shared/atoms/DatePicker";

export default function CustomFormat() {
	return <DatePicker formatDate="dd/MM/yyyy" onSelectDate={(value) => console.log(value)} />;
}`,
			`import DatePicker from "@components/shared/atoms/DatePicker";

export default function WithError() {
	return (
		<DatePicker
			errorMessage="This field is required"
			onSelectDate={(value) => console.log(value)}
		/>
	);
}`,
		],
	},
	{
		key: "date-time-picker",
		name: "DateTimePicker",
		description: "Date + time selection with min/max validation and clear control.",
		group: "atoms",
		usage: `import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export default function Example() {
	return (
		<DateTimePicker
			enableSeconds
			onSelectDateTime={(value) => console.log(value)}
		/>
	);
}`,
		examples: [
			`import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export default function Basic() {
	return (
		<DateTimePicker
			onSelectDateTime={(value) => console.log("Selected:", value)}
		/>
	);
}`,
			`import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export default function WithLimits() {
	return (
		<DateTimePicker
			minTime="08:30"
			maxTime="18:00"
			onSelectDateTime={(value) => console.log(value)}
		/>
	);
}`,
			`import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export default function WithSeconds() {
	return (
		<DateTimePicker
			enableSeconds
			minTime="08:30:00"
			maxTime="18:00:30"
			onSelectDateTime={(value) => console.log(value)}
		/>
	);
}`,
			`import DateTimePicker from "@components/shared/atoms/DateTimePicker";

export default function WithError() {
	return (
		<DateTimePicker
			errorMessage="This field is required"
			onSelectDateTime={(value) => console.log(value)}
		/>
	);
}`,
		],
	},
	{
		key: "button",
		name: "Button",
		description: "Primary and secondary actions with consistent states.",
		group: "atoms",
		usage: `import { Button } from "@components/ui/button";

export default function Example() {
	return <Button>Save changes</Button>;
}`,
	},
	{
		key: "input",
		name: "Input",
		description: "Text input with base styling and focus states.",
		group: "atoms",
		usage: `import { Input } from "@components/ui/input";

export default function Example() {
	return <Input placeholder="Search..." />;
}`,
	},
	{
		key: "tooltip",
		name: "Tooltip",
		description: "Hover helper text with lightweight overlay.",
		group: "atoms",
		usage: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";

export default function Example() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>Hover me</TooltipTrigger>
				<TooltipContent>Helpful hint</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}`,
	},
	{
		key: "input-form",
		name: "InputForm",
		description: "Form field wrapper with label and validation display.",
		group: "molecules",
		usage: `import { InputForm } from "@components/shared/molecules";

export default function Example() {
	return <InputForm label="Email" name="email" />;
}`,
	},
	{
		key: "modal",
		name: "Modal",
		description: "Dialog shell for confirmations or custom content.",
		group: "molecules",
		usage: `import { Modal } from "@components/shared/molecules";

export default function Example() {
	return (
		<Modal title="Invite team" open onClose={() => undefined}>
			<div>Modal content</div>
		</Modal>
	);
}`,
	},
	{
		key: "pagination",
		name: "Pagination",
		description: "Pagination controls with numeric navigation.",
		group: "molecules",
		usage: `import { Pagination } from "@components/shared/molecules";

export default function Example() {
	return <Pagination page={1} totalPages={8} onChange={() => undefined} />;
}`,
	},
	{
		key: "sidebar",
		name: "Sidebar",
		description: "Primary navigation surface for app sections.",
		group: "organisms",
		usage: `import { Sidebar } from "@components/shared/organisms";

export default function Example() {
	return <Sidebar />;
}`,
	},
	{
		key: "data-table",
		name: "DataTable",
		description: "Data grid with sorting and row actions.",
		group: "organisms",
		usage: `import { DataTable } from "@components/shared/organisms";

export default function Example() {
	return <DataTable />;
}`,
	},
	{
		key: "filter",
		name: "Filter",
		description: "Filter panel for collection and list views.",
		group: "organisms",
		usage: `import { Filter } from "@components/shared/organisms";

export default function Example() {
	return <Filter />;
}`,
	},
];

export const getComponentsByGroup = (group: ComponentGroupKey) =>
	componentCatalog.filter((item) => item.group === group);

export const getComponentByKey = (key: string) => componentCatalog.find((item) => item.key === key);

export const getSidebarGroups = (): ComponentSidebarGroup[] =>
	componentGroups.map((group) => ({
		key: group.key,
		label: group.label,
		items: getComponentsByGroup(group.key).map((item) => ({
			key: item.key,
			label: item.name,
			href: `/components/${item.key}`,
		})),
	}));
