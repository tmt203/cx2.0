"use client";

import { LogoPitel } from "@/public/images";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
} from "@components/ui/sidebar";
import Image from "next/image";

const sidebarItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
	},
	{
		title: "Workspace",
		children: [
			{ title: "Overview", href: "/workspace/overview" },
			{ title: "Projects", href: "/workspace/projects" },
			{ title: "Teams", href: "/workspace/teams" },
		],
	},
	{
		title: "Campaigns",
		children: [
			{ title: "All Campaigns", href: "/campaigns" },
			{ title: "Drafts", href: "/campaigns/drafts" },
			{ title: "Calendar", href: "/campaigns/calendar" },
		],
	},
	{
		title: "Analytics",
		children: [
			{ title: "Overview", href: "/analytics" },
			{ title: "Attribution", href: "/analytics/attribution" },
			{ title: "Reports", href: "/analytics/reports" },
		],
	},
	{
		title: "Automation",
		children: [
			{ title: "Flows", href: "/automation/flows" },
			{ title: "Rules", href: "/automation/rules" },
			{ title: "Logs", href: "/automation/logs" },
		],
	},
	{
		title: "Settings",
		children: [
			{ title: "Profile", href: "/settings/profile" },
			{ title: "Billing", href: "/settings/billing" },
			{ title: "Integrations", href: "/settings/integrations" },
		],
	},
];

const AppSidebar = () => {
	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton className="mx-auto">
										<div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent">
											<Image src={LogoPitel} alt="Pitel Logo" />
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">ORG SERVICE</span>
											<span className="truncate text-xs">SNS Final</span>
										</div>
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-[--radix-popper-anchor-width]">
									<DropdownMenuItem>
										<span>Acme Inc</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarMenu>
							{sidebarItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.href ?? "#"}>{item.title}</a>
									</SidebarMenuButton>
									{item.children ? (
										<SidebarMenuSub>
											{item.children.map((child) => (
												<SidebarMenuSubItem key={child.title}>
													<SidebarMenuSubButton asChild>
														<a href={child.href}>{child.title}</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									) : null}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</SidebarProvider>
	);
};

export default AppSidebar;
