"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { items } from "@/app/customer/customer_menus"
import Link from "next/link"
import { usePathname } from "next/navigation" 
import { Droplets, LogOut } from "lucide-react"

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617]">
      <SidebarHeader className="h-20 flex items-center justify-center px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Droplets className="w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                  PDAM <span className="text-blue-600">APP</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Customer Portal
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 opacity-50" />

      <SidebarContent className="px-3 mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = pathname === item.url
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        h-11 px-4 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:text-white" 
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 text-current">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500 transition-colors"}`} />
                        <span className="font-bold text-sm tracking-tight">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-4">
           <SidebarGroupLabel className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            Account Support
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className="h-11 px-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Keluar Sistem</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
