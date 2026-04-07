import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CustomerSidebar } from "@/components/customer-template/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDAM App - Customer",
  description: "Customer portal for PDAM App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <CustomerSidebar/>        
          <main className="flex-1 w-full min-w-0"> 
            <SidebarTrigger/>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}