import type { SidebarProps } from "./sidebar.interface";

const EXAMPLE_SIDEBAR: SidebarProps = {
	organization: {
		serviceName: "PITEL-CX SERVICE",
		tenantName: "TEL4VN",
		logoUrl: "http://localhost:3000/logo-pitel.png",
	},
	services: [
		{
			name: "Admin",
			url: "https://cloud.uat.pitel.vn/admin",
			logoUrl: "https://cloud.uat.pitel.vn/files/shared/Pitel.png",
		},
		{
			name: "Billing",
			url: "https://cloud.uat.pitel.vn/billing",
			logoUrl: "https://cloud.uat.pitel.vn/files/shared/Pitel.png",
		},
		{
			name: "SNS",
			url: "https://cloud.uat.pitel.vn/sns",
			logoUrl: "https://cloud.uat.pitel.vn/files/shared/Pitel.png",
		},
	],
    navigationItems: [
        
    ],
};
