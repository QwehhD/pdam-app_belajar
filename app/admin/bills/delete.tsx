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
import { Bills } from "@/app/types";
import { Trash2 } from "lucide-react";

interface DeleteBillsProps {
  selectedData: Bills;
}

const DeleteBills = ({ selectedData }: DeleteBillsProps) => {
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

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/${selectedData.id}`

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
                toast.success(result?.message || "Tagihan berhasil dihapus")
                setOpen(false)
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                const errorMsg = result?.message || "Gagal menghapus tagihan"
                toast.error(errorMsg)
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error deleting bill:", error)
            
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
                    <DialogTitle>Hapus Tagihan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus tagihan untuk <strong>{selectedData.customer?.name}</strong> bulan {selectedData.month}/{selectedData.year}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>Batal</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Menghapus..." : "Hapus"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBills;
