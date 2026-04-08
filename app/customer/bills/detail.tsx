"use client"

import { Bills } from "@/app/types";
import { getCookie } from "@/lib/client-cookies";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Calendar, DollarSign, CheckCircle, XCircle, Receipt, Clock, Droplets, CreditCard, User, FileCheck } from "lucide-react";

interface DetailBillProps {
    billId: number;
}

const DetailBill = ({ billId }: DetailBillProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [billDetail, setBillDetail] = useState<Bills | null>(null);

    const fetchBillDetail = async () => {
        try {
            setLoading(true);
            const token = await getCookie("accessToken");
            
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali");
                setLoading(false);
                return;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me/${billId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        "Authorization": `Bearer ${token}`,
                    },
                    signal: controller.signal
                }
            ).finally(() => clearTimeout(timeoutId));

            const result = await response.json();
            
            if (result?.success && result?.data) {
                setBillDetail(result.data);
            } else {
                toast.error(result?.message || "Gagal memuat detail tagihan");
            }
        } catch (error: any) {
            console.error("Error fetching bill detail:", error);
            if (error?.name === 'AbortError') {
                toast.error("Koneksi timeout. Server tidak merespon");
            } else {
                toast.error("Gagal memuat detail tagihan");
            }
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setOpen(true);
        fetchBillDetail();
    };

    const getMonthName = (month: number) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[month - 1] || '-';
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    onClick={openModal} 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        Detail Tagihan #{billId}
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap tagihan Anda
                    </DialogDescription>
                </DialogHeader>
                
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-sm text-slate-500">Memuat data...</p>
                        </div>
                    </div>
                ) : billDetail ? (
                    <div className="space-y-4">
                        {/* Payment Status Badge */}
                        <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                                billDetail.paid 
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}>
                                {billDetail.paid ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <Clock className="h-4 w-4" />
                                )}
                                {billDetail.paid ? "Lunas" : "Belum Lunas"}
                            </span>
                        </div>

                        {/* Grid Layout - 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Bill Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <Receipt className="h-4 w-4 text-purple-500" />
                                    Info Tagihan
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">ID</span>
                                        <span className="font-medium text-slate-900 dark:text-white">#{billDetail.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Periode</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {getMonthName(billDetail.month)} {billDetail.year}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            Rp {billDetail.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">No. Meteran</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {billDetail.measurement_number}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    Info Pemakaian
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Pemakaian</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {billDetail.usage_value} m³
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Harga/m³</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            Rp {billDetail.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Layanan</span>
                                        <span className="font-medium text-slate-900 dark:text-white text-right truncate max-w-[120px]">
                                            {billDetail.service?.name || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-emerald-500" />
                                    Info Pelanggan
                                </h3>
                                {billDetail.customer ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Nama</span>
                                            <span className="font-medium text-slate-900 dark:text-white text-right truncate max-w-[120px]">
                                                {billDetail.customer.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">No.</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {billDetail.customer.customer_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Telp</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {billDetail.customer.phone}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">Data tidak tersedia</p>
                                )}
                            </div>
                        </div>

                        {/* Payment History */}
                        {billDetail.payments && billDetail.payments.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                    Riwayat Pembayaran
                                </h3>
                                <div className="space-y-2">
                                    {billDetail.payments.map((payment) => (
                                        <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-900 rounded-lg">
                                            <div>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    Rp {payment.total_amount.toLocaleString('id-ID')}
                                                </span>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                payment.verified 
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}>
                                                {payment.verified ? "Verified" : "Pending"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="text-xs text-slate-400 dark:text-slate-500 text-center flex justify-center gap-4">
                            <span>Dibuat: {new Date(billDetail.createdAt).toLocaleString('id-ID')}</span>
                            <span>•</span>
                            <span>Diperbarui: {new Date(billDetail.updatedAt).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                            <p className="text-slate-500">Gagal memuat data tagihan</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DetailBill;
