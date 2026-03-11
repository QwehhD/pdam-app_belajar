import { Customer } from "@/app/types";
import AddCustomer from "./add";
import EditCustomer from "./edit";
import DeleteCustomer from "./delete";
import DetailCustomer from "./detail";
import { Card, CardContent } from "@/components/ui/card";
import getCustomer from "./get";
import { User, Phone, MapPin, Contact, Search as SearchIcon, ShieldCheck } from "lucide-react";
import SimplePagination from "@/components/Pagination";
import Search from "@/components/Search";
import WarningToast from "@/components/WarningToast";
import ResetCustomer from "./reset-password";

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

export default async function CustomersPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 3
    const search = (await prop.searchParams)?.search || ""
    
    const result = await getCustomer(page, quantity, search)
    const {count: counts, data: customers, success, message} = result

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Full Width */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600/10 dark:bg-emerald-500/10 rounded-2xl">
                            <Contact className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Database Customer
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {counts} Pelanggan Terdaftar
                            </p>
                        </div>
                    </div>
                    
                    <AddCustomer />
                </div>
            </div>

            <WarningToast success={success} message={message} isEmpty={customers.length === 0 && success} />

            {/* Main Content Area */}
            <div className="w-full px-6 py-8 lg:px-12">
                
                {/* Search Bar Container */}
                <div className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="flex-1 max-w-2xl">
                        <Search search={search ?? ""} />
                    </div>
                </div>

                {!success && customers.length === 0 ? (
                    <Card className="border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-xl shadow-red-500/5">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 text-3xl">⚠️</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gagal Memuat Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">{message || "Terjadi kendala saat menghubungkan ke server."}</p>
                        </CardContent>
                    </Card>
                ) : customers.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-slate-50 dark:bg-slate-800 mb-6 text-3xl">🔍</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Tidak Ditemukan</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Tidak ada data untuk "{search}". Coba kata kunci lain.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {customers.map((customer) => (
                            <Card 
                                key={customer.id} 
                                className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    {/* Left: Identity Section */}
                                    <div className="flex items-start md:items-center gap-5 flex-[1.5]">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {customer.name}
                                                </h2>
                                                <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-800">
                                                    #{customer.customer_number}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                @{customer.user.username}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Contact & Address Section */}
                                    <div className="flex-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:px-8 lg:border-x border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <Phone className="h-4 w-4 text-emerald-500" />
                                            </div>
                                            <span className="text-sm font-medium">{customer.phone}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                                <MapPin className="h-4 w-4 text-orange-500" />
                                            </div>
                                            <span className="text-sm font-medium line-clamp-2 leading-tight">
                                                {customer.address}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0 justify-end">
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <DetailCustomer selectedData={customer} />
                                            <EditCustomer selectedData={customer} />
                                            <ResetCustomer selectedData={customer} />
                                            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
                                            <DeleteCustomer selectedData={customer} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Section */}
                <div className="mt-10 mb-20 flex justify-center lg:justify-end">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            </div>
        </div>
    );
}