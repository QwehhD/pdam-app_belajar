import { Admin } from "@/app/types";
// @ts-ignore
import AddAdmin from "./add";
// @ts-ignore
import EditAdmin from "./edit";
// @ts-ignore
import DeleteAdmin from "./delete";
// @ts-ignore
import DetailAdmin from "./detail";
// @ts-ignore
import ResetAdmin from "./reset-password";
import { Card, CardContent } from "@/components/ui/card";
import getAdmin from "./get";
import { User, Phone, ShieldCheck, Search as SearchIcon, Users } from "lucide-react";
import SimplePagination from "@/components/Pagination";
import Search from "@/components/Search";
import WarningToast from "@/components/WarningToast";

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

export default async function AdminsPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 3 // Dibulatkan ke 10 agar lebih rapi
    const search = (await prop.searchParams)?.search || ""

    const result = await getAdmin(page, quantity, search)
    const {count: counts, data: admins, success, message} = result

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Full Width */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 dark:bg-blue-500/10 rounded-2xl">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Manajemen Admin
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                {counts} Total Akun Terdaftar
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <AddAdmin />
                    </div>
                </div>
            </div>

            <WarningToast success={success} message={message} isEmpty={admins.length === 0 && success} />

            {/* Main Content Area */}
            <div className="w-full px-6 py-8 lg:px-12">
                
                {/* Search Bar Section */}
                <div className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="max-w-2xl">
                        <Search search={search ?? ""} />
                    </div>
                </div>

                {!success && admins.length === 0 ? (
                    <Card className="border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900">
                        <CardContent className="p-12 text-center">
                            <div className="inline-flex p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4 text-2xl">⚠️</div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gagal Memuat Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{message || "Terjadi kesalahan pada server."}</p>
                        </CardContent>
                    </Card>
                ) : admins.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-12 text-center">
                            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4 text-2xl">👤</div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Belum Ada Admin</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Data tidak ditemukan untuk pencarian "{search}"</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {admins.map((admin) => (
                            <Card 
                                key={admin.id} 
                                className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-5 gap-6">
                                    {/* Left: Info Profile */}
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="relative">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 dark:shadow-none">
                                                {admin.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {admin.name}
                                                </h2>
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                                                    Admin
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">@{admin.user.username}</p>
                                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {admin.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center/Meta: ID Info (Hidden on mobile) */}
                                    <div className="hidden xl:block px-8 border-x border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">ID Administrator</p>
                                        <code className="text-xs font-mono text-slate-600 dark:text-slate-300">{admin.id}</code>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 lg:bg-transparent lg:border-none lg:p-0">
                                        <DetailAdmin selectedData={admin} />
                                        <EditAdmin selectedData={admin} />
                                        <ResetAdmin selectedData={admin} />
                                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden lg:block"></div>
                                        <DeleteAdmin selectedData={admin} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Section */}
                <div className="mt-10 mb-20 flex justify-center lg:justify-end">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            </div>
        </div>
    );
}