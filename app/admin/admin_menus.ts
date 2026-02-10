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
        url: "#",
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
        title: "Bill", 
        url: "#",
        icon: Receipt,
    },
    {
        title: "Payments", 
        url: "#",
        icon: Receipt
    },
]