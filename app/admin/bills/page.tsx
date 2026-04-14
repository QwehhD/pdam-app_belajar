import AddBills from "./add";
import EditBills from "./edit";
import DeleteBills from "./delete";
import FilterStatus from "./filter";
import { Card, CardContent } from "@/components/ui/card";
import getBillsStats from "./get-stats";
import { Receipt, Calendar, Droplets, DollarSign, CheckCircle, XCircle, User, Hash, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import SimplePagination from "@/components/Pagination";
import Search from "@/components/Search";
import WarningToast from "@/components/WarningToast";
import VerifyBill from "./verify"
import { getBillsByAdmin } from "@/services/bills.admin";
import getCustomer from "../customer-data/get";

type Props = {
 searchParams: Promise<{
   page?: number
   quantity?: number
   search?: string
   status?: string
 }>

}

export default async function BillPage(prop: Props) {
 const page = (await prop.searchParams)?.page || 1
 const quantity = (await prop.searchParams)?.quantity || 5
 const search = (await prop.searchParams)?.search || ""
 const status = (await prop.searchParams)?.status || "all"
 const { counts, bills } = await getBillsByAdmin({ page, quantity, search });
 const customerResult = await getCustomer(1, 1000, "");
 const stats = await getBillsStats();

 let filteredBills = bills


 if (status === "unpaid") {
   filteredBills = bills.filter(b => b.payments == null)
 }


 if (status === "pending") {
   filteredBills = bills.filter(b => b.payments && !b.payments.verified)
 }


 if (status === "paid") {
   filteredBills = bills.filter(b => b.payments?.verified)
 }



    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Full Width */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600/10 dark:bg-emerald-500/10 rounded-2xl">
                            <Receipt className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Database Tagihan
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {counts} Tagihan Terdaftar
                            </p>
                        </div>
                    </div>
                    
                    <AddBills/>
                </div>
            </div>

            <WarningToast success={counts > 0} message="Bills loaded successfully" isEmpty={bills.length === 0} />

            {/* Stats Monitoring Section */}
            <div className="w-full px-6 pt-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Tagihan */}
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tagihan</p>
                                    {/* <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p> */}
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sudah Lunas */}
                    <Card className="border-green-200 dark:border-green-900/50 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sudah Lunas</p>
                                    <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-1">{stats.paid}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(1) : 0}% dari total
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Belum Bayar */}
                    <Card className="border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Belum Bayar</p>
                                    <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">{stats.unpaid}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {stats.total > 0 ? ((stats.unpaid / stats.total) * 100).toFixed(1) : 0}% dari total
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full px-6 py-8 lg:px-12">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Data Tagihan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Kelola dan monitor semua data tagihan dengan mudah.</p>
                    
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <Search search={search ?? ""} />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Status:</label>
                            <FilterStatus />
                        </div>
                    </div>
                </div>
                
                {filteredBills.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-slate-50 dark:bg-slate-800 mb-6 text-3xl">🔍</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tagihan Tidak Ditemukan</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                {search ? `Tidak ada data untuk "${search}". Coba kata kunci lain.` : "Tidak ada tagihan yang sesuai dengan filter."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredBills.map((bill) => (
                            <Card 
                                key={bill.id} 
                                className={`group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl transition-all duration-300 ${
                                    bill.paid 
                                        ? "hover:shadow-green-500/5 border-l-4 border-l-green-500" 
                                        : "hover:shadow-red-500/5 border-l-4 border-l-red-500"
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    {/* Left: Identity Section */}
                                    <div className="flex items-start md:items-center gap-5 flex-[1.5]">
                                        <div className={`h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ${
                                            bill.paid 
                                                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-200 dark:shadow-none"
                                                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200 dark:shadow-none"
                                        }`}>
                                            {bill.customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {bill.customer.name.toUpperCase()}
                                                </h2>
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border ${
                                                    bill.paid 
                                                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800"
                                                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800"
                                                }`}>
                                                    {bill.paid ? (
                                                        <><CheckCircle className="h-3 w-3" /> Lunas</>
                                                    ) : (
                                                        <><XCircle className="h-3 w-3" /> Belum Bayar</>
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <Hash className="h-3 w-3" />
                                                {bill.measurement_number}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Bill Details Section */}
                                    <div className="flex-2 grid grid-cols-2 md:grid-cols-4 gap-4 lg:px-8 lg:border-x border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-medium">Periode</p>
                                                <span className="text-sm font-semibold">{bill.month}/{bill.year}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <Droplets className="h-4 w-4 text-cyan-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-medium">Pemakaian</p>
                                                <span className="text-sm font-semibold">{bill.usage_value} m³</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <DollarSign className="h-4 w-4 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-medium">Total</p>
                                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    Rp {bill.amount.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <User className="h-4 w-4 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-slate-400 font-medium">Layanan</p>
                                                <span className="text-sm font-semibold truncate max-w-[80px] block">
                                                    {bill.service?.name || "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0 justify-end">
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <EditBills selectedData={bill} />
                                            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
                                            <DeleteBills selectedData={bill} />

                                            <VerifyBill selectedData={bill} />
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