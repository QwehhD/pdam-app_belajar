import { getCookie } from "@/lib/server-cookies";
import { Customer } from "@/app/types";
import AddCustomer from "./add";
import EditCustomer from "./edit";
import DeleteCustomer from "./delete";
import DetailCustomer from "./detail";
import { Card } from "@/components/ui/card";
import getCustomer from "./get";
import { User, Phone, MapPin } from "lucide-react";
import SimplePagination from "@/components/Pagination"
import Search from "@/components/Search"
import WarningToast from "@/components/WarningToast"

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

export default async function CustomersPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 9
    const search = (await prop.searchParams)?.search || ""
    const result = await getCustomer(page, quantity, search)
    const {count: counts, data: customers, success, message} = result

    return (
        <div className="container mx-auto py-10 px-4">
            <WarningToast success={success} message={message} isEmpty={customers.length === 0 && success} />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Customer</h1>
                    <p className="text-muted-foreground">Kelola informasi pelanggan Anda di sini.</p>
                </div>
                
                <AddCustomer />
            </div>

            {!success && customers.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-lg font-medium text-red-600">⚠️ Gagal Memuat Data</p>
                    <p className="text-sm text-muted-foreground mt-2">{message || "Tidak bisa terhubung ke server. Silakan coba lagi."}</p>
                </Card>
            ) : customers.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-lg font-medium">Belum Ada Customer</p>
                    <p className="text-sm text-muted-foreground">Mulai tambahkan customer pertama Anda hari ini</p>
                </Card>
            ) : (
                <div>
                    <div className="mb-6">
                        <Search search={search ?? ""} />
                    </div>
                    
                    <div className="space-y-4">
                        {customers.map((customer) => (
                            <Card key={customer.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">{customer.name}</h2>
                                                <p className="text-sm text-muted-foreground">@{customer.user.username}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center text-muted-foreground">
                                                <Phone className="mr-2 h-4 w-4" />
                                                {customer.phone}
                                            </div>
                                            <div className="flex items-start text-muted-foreground">
                                                <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                                                <span className="leading-relaxed">{customer.address}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground pt-2">
                                                No. Customer: <strong>{customer.customer_number}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailCustomer selectedData={customer} />
                                        <EditCustomer selectedData={customer} />
                                        <DeleteCustomer selectedData={customer} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="mt-8">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            )}
        </div>
    );
}