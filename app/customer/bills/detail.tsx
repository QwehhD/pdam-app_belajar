"use client"

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
import { CustomerPayment } from "./get";

interface DetailPaymentProps {
    paymentId: number;
}

const DetailPayment = ({ paymentId }: DetailPaymentProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentDetail, setPaymentDetail] = useState<CustomerPayment | null>(null);

    const fetchPaymentDetail = async () => {
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
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me/${paymentId}`,
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
                const rawData = result.data;
                const normalizedDetail: CustomerPayment = rawData?.bill_id
                    ? rawData
                    : {
                        id: rawData?.payments?.id ?? rawData.id,
                        bill_id: rawData.id,
                        payment_date: rawData?.payments?.payment_date ?? rawData.updatedAt,
                        verified: rawData?.payments?.verified ?? rawData.paid,
                        total_amount: rawData?.payments?.total_amount ?? rawData.amount ?? (rawData.usage_value * rawData.price),
                        payment_proof: rawData?.payments?.payment_proof ?? "",
                        owner_token: rawData.owner_token,
                        createdAt: rawData?.payments?.createdAt ?? rawData.createdAt,
                        updatedAt: rawData?.payments?.updatedAt ?? rawData.updatedAt,
                        bill: {
                            id: rawData.id,
                            customer_id: rawData.customer_id,
                            admin_id: rawData.admin_id,
                            month: rawData.month,
                            year: rawData.year,
                            measurement_number: rawData.measurement_number,
                            usage_value: rawData.usage_value,
                            price: rawData.price,
                            service_id: rawData.service_id,
                            paid: rawData.paid,
                            owner_token: rawData.owner_token,
                            createdAt: rawData.createdAt,
                            updatedAt: rawData.updatedAt,
                            admin: rawData.admin,
                            customer: rawData.customer,
                            service: rawData.service,
                        }
                    };

                setPaymentDetail(normalizedDetail);
            } else {
                toast.error(result?.message || "Gagal memuat detail pembayaran");
            }
        } catch (error: any) {
            console.error("Error fetching payment detail:", error);
            if (error?.name === 'AbortError') {
                toast.error("Koneksi timeout. Server tidak merespon");
            } else {
                toast.error("Gagal memuat detail pembayaran");
            }
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setOpen(true);
        fetchPaymentDetail();
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
                        Detail Pembayaran #{paymentId}
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap pembayaran Anda
                    </DialogDescription>
                </DialogHeader>
                
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-sm text-slate-500">Memuat data...</p>
                        </div>
                    </div>
                ) : paymentDetail ? (
                    <div className="space-y-4">
                        {/* Payment Status Badge */}
                        <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                                paymentDetail.verified 
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}>
                                {paymentDetail.verified ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <Clock className="h-4 w-4" />
                                )}
                                {paymentDetail.verified ? "Terverifikasi" : "Menunggu Verifikasi"}
                            </span>
                        </div>

                        {/* Grid Layout - 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Payment Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                    Info Pembayaran
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">ID</span>
                                        <span className="font-medium text-slate-900 dark:text-white">#{paymentDetail.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tanggal</span>
                                        <span className="font-medium text-slate-900 dark:text-white text-right">
                                            {new Date(paymentDetail.payment_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            Rp {paymentDetail.total_amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Bukti</span>
                                        <span className="font-medium">
                                            {paymentDetail.payment_proof ? (
                                                <span className="text-blue-500">✓ Tersedia</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bill Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <Receipt className="h-4 w-4 text-purple-500" />
                                    Info Tagihan
                                </h3>
                                {paymentDetail.bill ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">ID</span>
                                            <span className="font-medium text-slate-900 dark:text-white">#{paymentDetail.bill.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Periode</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {getMonthName(paymentDetail.bill.month)} {paymentDetail.bill.year}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Pemakaian</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {paymentDetail.bill.usage_value} m³
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Harga/m³</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                Rp {paymentDetail.bill.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">No. Meteran</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {paymentDetail.bill.measurement_number}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">Data tidak tersedia</p>
                                )}
                            </div>

                            {/* Customer & Service Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-emerald-500" />
                                    Info Pelanggan
                                </h3>
                                {paymentDetail.bill?.customer ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Nama</span>
                                            <span className="font-medium text-slate-900 dark:text-white text-right truncate max-w-[120px]">
                                                {paymentDetail.bill.customer.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">No.</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {paymentDetail.bill.customer.customer_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Telp</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {paymentDetail.bill.customer.phone}
                                            </span>
                                        </div>
                                        {paymentDetail.bill.service && (
                                            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                                <span className="text-slate-500">Layanan</span>
                                                <span className="font-medium text-slate-900 dark:text-white text-right truncate max-w-[100px]">
                                                    {paymentDetail.bill.service.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">Data tidak tersedia</p>
                                )}
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="text-xs text-slate-400 dark:text-slate-500 text-center flex justify-center gap-4">
                            <span>Dibuat: {new Date(paymentDetail.createdAt).toLocaleString('id-ID')}</span>
                            <span>•</span>
                            <span>Diperbarui: {new Date(paymentDetail.updatedAt).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                            <p className="text-slate-500">Gagal memuat data pembayaran</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default DetailPayment;
