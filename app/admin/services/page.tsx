import { getCookie } from "@/lib/server-cookies";
import { Services } from "@/app/types";
import AddService from "./add";
import EditService from "./edit";
import DeleteService from "./delete";
import DetailService from "./detail";
import { Card, CardContent } from "@/components/ui/card";
import Search from "@/components/Search"
import SimplePagination from "@/components/Pagination"
import WarningToast from "@/components/WarningToast"
import { Package, Zap, ArrowRight, Gauge, Layers } from "lucide-react";

type ResultData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

async function getServices(page:number, quantity:number, search:string): Promise<ResultData> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`
        
        const fetchWithTimeout = (timeout: number = 8000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            return fetch(url, {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store",
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
        };

        const response = await fetchWithTimeout();
        const responseData: ResultData = await response.json()

        if (!response.ok) {
            return {
                success: responseData.success,
                message: responseData.message,
                data: [],
                count: 0,
            };
        }
        
        return {
            success: responseData.success,
            message: responseData.message,
            data: responseData.data,
            count: responseData.count,
        }

    } catch (error: any) {
        return {
            success: false,
            message: "Error fetching services",
            data: [],
            count: 0
        };
    }
}

export default async function ServicesPage (prop: Props)  {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 4
    const search = (await prop.searchParams)?.search || ""
    const result = await getServices(page, quantity, search)
    const {count: counts, data: services, success, message} = result
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Edge to Edge */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                            <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Katalog Layanan
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                {counts} Paket Layanan Aktif
                            </p>
                        </div>
                    </div>
                    
                    <AddService />
                </div>
            </div>

            <WarningToast success={success} message={message} isEmpty={services.length === 0 && success} />

            {/* Main Content Area */}
            <div className="w-full px-6 py-8 lg:px-12">
                
                {/* Search Bar Container */}
                <div className="mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="max-w-2xl">
                        <Search search={search ?? ``}/>
                    </div>
                </div>

                {!success && services.length === 0 ? (
                    <Card className="border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-red-50 dark:bg-red-900/20 mb-6 text-3xl">⚠️</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gagal Memuat Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{message || "Terjadi kendala teknis."}</p>
                        </CardContent>
                    </Card>
                ) : services.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-16 text-center">
                            <div className="inline-flex p-5 rounded-full bg-slate-50 dark:bg-slate-800 mb-6 text-3xl">📦</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Belum Ada Service</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Daftar layanan Anda masih kosong atau pencarian tidak ditemukan.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <Card 
                                key={service.id} 
                                className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    {/* Service Icon & Name */}
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {service.name}
                                            </h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                <Gauge className="w-4 h-4 text-indigo-400" />
                                                <span>Range: {service.min_usage} - {service.max_usage} m³</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="lg:px-12 flex flex-col items-start lg:items-center justify-center lg:border-x border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Biaya Langganan</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                                Rp {service.price?.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">/bulan</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <DetailService selectedData={service}/>
                                            <EditService selectedData={service}/>
                                            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
                                            <DeleteService selectedData={service}/>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                <div className="mt-10 mb-20 flex justify-center lg:justify-end">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            </div>
        </div>
    )
}