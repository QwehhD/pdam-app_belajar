import { Home, UserPen, Receipt, CreditCard } from "lucide-react";


export const items = [
    {
        title: "Home", 
        url: "/customer/dashboard",
        icon: Home,
    },
    {
        title: "My Profile", 
        url: "/customer/profile",
        icon: UserPen,
    },
    {
        title: "My Bills", 
        url: "/customer/bills",
        icon: Receipt,
    },
    {
        title: "My Payments", 
        url: "/customer/payments",
        icon: CreditCard
    },
]