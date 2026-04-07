import { Home, UserPen, User, Users, Toolbox, Receipt } from "lucide-react";


export const items = [
    {
        title: "Home", 
        url: "/customer/dashboard",
        icon: Home,
    },
    {
        title: "My Profile", 
        url: "#",
        icon: UserPen,
    },
    {
        title: "Admin Data", 
        url: "#",
        icon: User,
    },
    {
        title: "Customer Data", 
        url: "#",
        icon: Users,
    },
    {
        title: "Services", 
        url: "#",
        icon: Toolbox
    },
    {
        title: "Bills", 
        url: "#",
        icon: Receipt,
    },
    {
        title: "Payments", 
        url: "/#",
        icon: Receipt
    },
]