import { Card, CardContent } from "@/components/ui/card";
import getCustomerBills from "./get";
import DetailBill from "./detail";
import AddPayment from "./add-payment";
import { CreditCard, Calendar, DollarSign, Receipt, CheckCircle, Clock, BarChart3, ShieldCheck, FileCheck } from "lucide-react";
import SimplePagination from "@/components/Pagination";
import Search from "@/components/Search";
import WarningToast from "@/components/WarningToast";
import { PaymentProofPreview } from "./proof";
import { Bills } from "@/app/types";

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

const getStatus = (bills: Bills) => {
       if (bills.payments == null) return "unpaid"
       if (!bills.payments?.verified) return "pending"
       return "paid"
   }

export default async function CustomerBillsPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 10
    const search = (await prop.searchParams)?.search || ""
    
    const result = await getCustomerBills(page, quantity, search)
    const {count: counts, data: bills, success, message} = result

    // Calculate stats
    const totalBills = counts
    const paidBills = bills.filter(b => b.paid).length
    const unpaidBills = bills.filter(b => !b.paid).length

    const getMonthName = (month: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return months[month - 1] || '-';
    };

    return (
        
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Full Width */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 dark:bg-blue-500/10 rounded-2xl">
                            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Tagihan Saya
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                {counts} Tagihan Terdaftar
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <WarningToast success={success} message={message} isEmpty={bills.length === 0 && success} />
                
            {/* Stats Monitoring Section */}
            <div className="w-full px-6 pt-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Bills */}
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tagihan</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalBills}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Paid */}
                    <Card className="border-green-200 dark:border-green-900/50 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lunas</p>
                                    <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-1">{paidBills}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {bills.length > 0 ? ((paidBills / bills.length) * 100).toFixed(1) : 0}% dari halaman ini
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unpaid */}
                    <Card className="border-yellow-200 dark:border-yellow-900/50 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Belum Lunas</p>
                                    <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mt-1">{unpaidBills}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        {bills.length > 0 ? ((unpaidBills / bills.length) * 100).toFixed(1) : 0}% dari halaman ini
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full px-6 py-8 lg:px-12">
                
                {/* Search Bar Container */}
                <div className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="flex-1 max-w-2xl">
                        <Search search={search ?? ""} />
                    </div>
                </div>

                {!success && bills.length === 0 ? (
                    <Card className="border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-xl shadow-red-500/5">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 text-3xl">⚠️</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gagal Memuat Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">{message || "Terjadi kendala saat menghubungkan ke server."}</p>
                        </CardContent>
                    </Card>
                ) : bills.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-slate-50 dark:bg-slate-800 mb-6 text-3xl">🔍</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tagihan Tidak Ditemukan</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Tidak ada tagihan untuk "{search}". Coba kata kunci lain.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bills.map((bill) => (
                            <Card 
                                key={bill.id} 
                                className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    {/* Left: Identity Section */}
                                    <div className="flex items-start md:items-center gap-5 flex-[1.5]">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    Tagihan #{bill.id}
                                                </h2>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border ${
                                                    getStatus(bill) 
                                                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800"
                                                        : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800"
                                                }`}>
                                                    {getStatus(bill)}
                                                    
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                {getMonthName(bill.month)} {bill.year} • No. Meteran: {bill.measurement_number}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Bill Details Section */}
                                    <div className="flex-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:px-8 lg:border-x border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {new Date(bill.createdAt).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                                <DollarSign className="h-4 w-4 text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Rp {bill.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                                <FileCheck className="h-4 w-4 text-purple-500" />
                                            </div>
                                            <span className="text-sm font-medium line-clamp-2 leading-tight">
                                                Pemakaian: {bill.usage_value} m³
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                                                <Receipt className="h-4 w-4 text-cyan-500" />
                                            </div>
                                            <span className="text-sm font-medium line-clamp-2 leading-tight">
                                                {bill.service?.name || '-'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0 justify-end">
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <DetailBill billId={bill.id} />
                                            {!bill.paid && <AddPayment bill={bill} />}
                                        </div>
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <DetailBill billId={bill.id} />
                                            (<PaymentProofPreview filename={bill.payments.payment_proof}/>
                                        )
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Section */}
                <div className="mt-10 mb-20 flex justify-center lg:justify-end">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-800">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            </div>
        </div>
    );
}
