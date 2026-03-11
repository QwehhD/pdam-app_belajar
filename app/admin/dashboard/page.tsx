import { Admin } from "@/app/types"
import { getCookie } from "@/lib/server-cookies";
import WarningToast from "@/components/WarningToast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, ShieldCheck, Calendar, ArrowRight, LayoutDashboard, Settings } from "lucide-react"

type ResultData = {
    success: boolean,
    message: string,
    data: Admin
}

type DashboardResult = {
    success: boolean
    message: string
    data: Admin | null
}

async function getAdminProfile(): Promise<DashboardResult> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`
        
        const fetchWithTimeout = (timeout: number = 8000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            return fetch(url, {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
        };

        const response = await fetchWithTimeout()
        const responseData: ResultData = await response.json()

        if (!response.ok) {
            return {
                success: false,
                message: responseData?.message || "Gagal memuat data admin",
                data: null
            }
        }
        
        return { success: true, message: "", data: responseData.data }
    } catch (error: any) {
        return {
            success: false,
            message: error?.name === 'AbortError' ? "Koneksi timeout" : "Gagal memuat data admin",
            data: null
        }
    }
}

export default async function DashboardAdmin() {
    const result = await getAdminProfile()
    const adminData = result.data
    
    if (!result.success || adminData == null) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
                <WarningToast success={result.success} message={result.message} />
                <Card className="max-w-md w-full border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-xl">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="rounded-full bg-red-50 dark:bg-red-900/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gagal Memuat Data</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">{result.message}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const initial = adminData.name?.charAt(0).toUpperCase() || "A";

    return (
        // MENGGUNAKAN min-h-screen dan w-full, tanpa 'container'
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            
            {/* Header Section - Full Width Edge to Edge */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 dark:bg-blue-500/10 rounded-xl">
                            <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Dashboard Admin
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">
                                Control Panel
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 pr-6 rounded-full border border-slate-200 dark:border-slate-700">
                        <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            {initial}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{adminData.name}</p>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase mt-1">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Width dengan Padding Horizontal yang sama dengan My Profile */}
            <div className="w-full px-6 py-8 lg:px-12">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    
                    {/* Left Column: Detailed Info (3 Units) */}
                    <div className="xl:col-span-3 space-y-8">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-lg font-bold dark:text-white">Informasi Akun Utama</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                    <div className="p-8 space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Nama Lengkap</label>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-200 mt-1">{adminData.name}</p>
                                        </div>
                                        <div className="group">
                                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Username Pengguna</label>
                                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">@{adminData.user.username}</p>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Kontak Telepon</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                <p className="text-lg font-semibold text-slate-900 dark:text-slate-200">{adminData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Status Akses</label>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    Active Member
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: System Info (1 Unit) */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                                    <Settings className="w-3 h-3" />
                                    <span>System Meta Data</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-0">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-1">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">ID Unik Admin</span>
                                    </div>
                                    <code className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 break-all">
                                        {adminData.id}
                                    </code>
                                </div>
                                
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Update Terakhir</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {new Date(adminData.updatedAt).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <a 
                                    href="/admin/profile" 
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20"
                                >
                                    Buka Pengaturan Profil
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}