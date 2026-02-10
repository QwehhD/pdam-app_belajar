"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  User, 
  Settings, 
  LayoutDashboard, 
  LogOut 
} from 'lucide-react'; // Saya sarankan install lucide-react untuk icon yang clean

export default function Sidebar() {
  const menuItems = [
    { name: 'Home', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', href: '/', icon: <User size={20} /> },
    { name: 'Admin Data', href: '/', icon: <Home size={20} /> },
    { name: 'Customer Data', href: '/', icon: <Settings size={20} /> },
    { name: 'Services', href: '/', icon: <Settings size={20} /> },
    { name: 'Bill', href: '/', icon: <Settings size={20} /> },
    { name: 'Payments', href: '/', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-blue-100 backdrop-blur-sm border-r border-blue-100 flex flex-col justify-between p-4">
      <div>
        {/* Header Sidebar / Logo */}
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold text-blue-700 tracking-tight">
            Main<span className="text-blue-400">Panel</span>
          </h2>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-slate-600 rounded-lg hover:bg-blue-100/50 hover:text-blue-700 transition-all group"
            >
              <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Sidebar (Logout atau Profile) */}
      <div className="border-t border-blue-100 pt-4">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}