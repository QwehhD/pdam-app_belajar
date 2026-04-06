"use client"

import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Payments } from "@/app/types";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeletePaymentProps {
  selectedData: Payments;
}

const DeletePayment = ({ selectedData }: DeletePaymentProps) => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            setLoading(true)
        
            const token = await getCookie("accessToken");
            
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${selectedData.id}`

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId))

            const result = await response.json()

            if (result?.success) {
                toast.success(result?.message || "Pembayaran berhasil dihapus")
                setOpen(false)
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                const errorMsg = result?.message || "Gagal menghapus pembayaran"
                toast.error(errorMsg)
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error deleting payment:", error)
            
            if (error?.name === 'AbortError') {
                toast.error("Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan")
            } else {
                toast.error(error?.message || "Koneksi gagal. Periksa koneksi internet Anda")
            }
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle>Hapus Pembayaran</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Apakah Anda yakin ingin menghapus pembayaran dengan ID <strong>#{selectedData.id}</strong>? 
                        <br />
                        <span className="text-red-500">Tindakan ini tidak dapat dibatalkan.</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Total Pembayaran</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            Rp {selectedData.total_amount.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-slate-500">Tanggal</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {new Date(selectedData.payment_date).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>Batal</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Menghapus..." : "Hapus Pembayaran"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePayment;
