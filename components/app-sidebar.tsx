"use client"

import { SidebarFooter } from "@/components/ui/sidebar"

import Link from "next/link"

import { SidebarMenuButton } from "@/components/ui/sidebar"

import { SidebarMenuItem } from "@/components/ui/sidebar"

import { SidebarMenu } from "@/components/ui/sidebar"

import { SidebarGroupContent } from "@/components/ui/sidebar"

import { SidebarGroupLabel } from "@/components/ui/sidebar"

import { SidebarGroup } from "@/components/ui/sidebar"

import { SidebarContent } from "@/components/ui/sidebar"

import { SidebarHeader } from "@/components/ui/sidebar"

import { Sidebar } from "@/components/ui/sidebar"

import { usePathname } from "next/navigation"

import { Home, FolderKanban, Package, Users, ShoppingCart, Truck, ClipboardCheck, FileText, Settings, Bot } from "lucide-react"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Chatbot", url: "/chatbot", icon: Bot },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Purchase Orders", url: "/orders", icon: ShoppingCart },
  { title: "Receptions", url: "/receptions", icon: Truck },
  { title: "Quality Control", url: "/quality", icon: ClipboardCheck },
  { title: "Invoices", url: "/invoices", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <span className="font-semibold text-lg">Procurement</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
