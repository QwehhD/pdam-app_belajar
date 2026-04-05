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
import { Payments } from "@/app/types";
import { Eye, Calendar, DollarSign, FileCheck, CheckCircle, XCircle, CreditCard, Clock, User, Hash } from "lucide-react";

interface PaymentDetail extends Payments {
    bill?: {
        id: number
        customer_id: number
        month: number
        year: number
        measurement_number: string
        usage_value: number
        price: number
        paid: boolean
        customer?: {
            id: number
            name: string
            customer_number: string
            phone: string
            address: string
        }
    }
}

interface DetailPaymentProps {
    paymentId: number;
}

const DetailPayment = ({ paymentId }: DetailPaymentProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);

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
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${paymentId}`,
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
                setPaymentDetail(result.data);
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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        Detail Pembayaran #{paymentId}
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap pembayaran
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
                    <div className="space-y-6">
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

                        {/* Payment Info */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-500" />
                                Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <Hash className="h-4 w-4 text-slate-400" />
                                    <span>ID Pembayaran</span>
                                </div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    #{paymentDetail.id}
                                </div>
                                
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>Tanggal Bayar</span>
                                </div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {new Date(paymentDetail.payment_date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <DollarSign className="h-4 w-4 text-slate-400" />
                                    <span>Total Bayar</span>
                                </div>
                                <div className="font-bold text-green-600 dark:text-green-400">
                                    Rp {paymentDetail.total_amount.toLocaleString('id-ID')}
                                </div>
                                
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <FileCheck className="h-4 w-4 text-slate-400" />
                                    <span>Bukti Bayar</span>
                                </div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {paymentDetail.payment_proof ? (
                                        <a href={paymentDetail.payment_proof} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Lihat Bukti
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">Tidak ada</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bill Info */}
                        {paymentDetail.bill && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-purple-500" />
                                    Informasi Tagihan
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Hash className="h-4 w-4 text-slate-400" />
                                        <span>ID Tagihan</span>
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        #{paymentDetail.bill.id}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>Periode</span>
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.month}/{paymentDetail.bill.year}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <DollarSign className="h-4 w-4 text-slate-400" />
                                        <span>Nilai Pemakaian</span>
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.usage_value} m³
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <DollarSign className="h-4 w-4 text-slate-400" />
                                        <span>Harga Tagihan</span>
                                    </div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        Rp {paymentDetail.bill.price.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Customer Info */}
                        {paymentDetail.bill?.customer && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <User className="h-4 w-4 text-emerald-500" />
                                    Informasi Pelanggan
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-slate-600 dark:text-slate-300">Nama</div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.customer.name}
                                    </div>
                                    
                                    <div className="text-slate-600 dark:text-slate-300">No. Pelanggan</div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.customer.customer_number}
                                    </div>
                                    
                                    <div className="text-slate-600 dark:text-slate-300">Telepon</div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.customer.phone}
                                    </div>
                                    
                                    <div className="text-slate-600 dark:text-slate-300">Alamat</div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {paymentDetail.bill.customer.address}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="text-xs text-slate-400 dark:text-slate-500 text-center space-y-1">
                            <p>Dibuat: {new Date(paymentDetail.createdAt).toLocaleString('id-ID')}</p>
                            <p>Diperbarui: {new Date(paymentDetail.updatedAt).toLocaleString('id-ID')}</p>
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
