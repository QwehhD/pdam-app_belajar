"use client";

import { Customer } from "@/app/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";


const DeleteCustomer = ({ selectedData }: { selectedData: Customer }) => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)

            const token = await getCookie("accessToken")
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}`;

            console.log("Deleting customer with ID:", selectedData.id)

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`,
                },
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId))

            const result = await response.json();
            console.log("Delete customer response:", result)

            if (result?.success) {
                toast.success(result?.message || "Customer berhasil dihapus")
                setOpen(false)
                setLoading(false)
                setTimeout(() => router.refresh(), 300)
            } else {
                toast.error(result?.message || "Gagal menghapus customer")
                setLoading(false)
            }
        } catch (error: any) {
            console.error("Error deleting customer:", error)
            if (error?.name === "AbortError") {
                toast.error("Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan")
            } else {
                toast.error("Koneksi gagal. Periksa koneksi internet Anda")
            }
            setLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="destructive" 
                    onClick={openModal}
                >
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin menghapus customer ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Customer <strong>{selectedData.name}</strong> akan dihapus permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                        <Button 
                            type="submit" 
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCustomer;
