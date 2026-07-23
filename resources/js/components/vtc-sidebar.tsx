import { Link, usePage } from '@inertiajs/react';
import { Beaker, ClipboardList, FolderGit2, Package } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Generar VTC',
        href: '/vtc',
        icon: ClipboardList,
    },
    {
        title: 'Fórmulas',
        href: '/formulas',
        icon: Package,
    },
    {
        title: 'Jarabes',
        href: '/jarabes',
        icon: Beaker,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        href: 'https://github.com/Jeyson-Sr/vtc',
        icon: FolderGit2,
    },
];

function VtcLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#1a6b3c] text-white">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    VTC Caral
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Embotelladora Caral
                </span>
            </div>
        </>
    );
}

export function VtcSidebar() {
    const { auth } = usePage().props as { auth?: { user?: unknown } };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/vtc" prefetch>
                                <VtcLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {auth?.user ? (
                    <p className="px-2 text-xs text-muted-foreground">
                        Sesión activa
                    </p>
                ) : null}
            </SidebarFooter>
        </Sidebar>
    );
}
