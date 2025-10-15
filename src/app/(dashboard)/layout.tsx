'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  School,
  Users,
  Wallet,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/layout/UserNav';
import { GlobalStateProvider } from '@/lib/global-state';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/pupils', label: 'Pupils', icon: Users },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/expenses', label: 'Expenses', icon: Wallet },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <GlobalStateProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <School className="h-5 w-5" />
              </div>
              <span className="font-headline text-lg font-bold">
                Lady Sydah
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior={false} passHref>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                      tooltip={item.label}
                    >
                      <a>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4">
            <SidebarTrigger className="sm:hidden" />
            <div className="ml-auto flex items-center gap-2">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:px-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </GlobalStateProvider>
  );
}
