import { Home, UserPen, User, Users, Toolbox, Receipt } from "lucide-react";


export const items = [
    {
        title: "Home", 
        url: "/admin/dashboard",
        icon: Home,
    },
    {
        title: "My Profile", 
        url: "/admin/profile",
        icon: UserPen,
    },
    {
        title: "Admin Data", 
        url: "/admin/admin-data",
        icon: User,
    },
    {
        title: "Customer Data", 
        url: "/admin/customer-data",
        icon: Users,
    },
    {
        title: "Services", 
        url: "/admin/services",
        icon: Toolbox
    },
    {
        title: "Bills", 
        url: "/admin/bills",
        icon: Receipt,
    },
    {
        title: "Payments", 
        url: "#",
        icon: Receipt
    },
]