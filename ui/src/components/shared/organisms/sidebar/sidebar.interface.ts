type Organization = {
    serviceName: string;
    tenantName: string;
    logoUrl?: string;
};

type Service = {
    name: string;
    url: string;
    logoUrl?: string;
}

type NavigationItem = {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    children?: NavigationItem[];
}

export interface SidebarProps {
    organization: Organization;
    services: Service[];
    navigationItems: NavigationItem[];
}