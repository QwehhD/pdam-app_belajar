"use client"

import { Customer } from "@/app/types";
import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { decryptPassword } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog";

const ResetCustomer = ({ selectedData }: { selectedData: Customer }) => {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");

    const openModal = () => {
        setOpen(true);
        setNewPassword("");
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault();
            if (!newPassword.trim() || newPassword.length < 5) {
                toast.error("Masukkan password baru (min 5 karakter)");
                return;
            }
            setLoading(true);

            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali");
                setLoading(false);
                return;
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}/reset-password`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: newPassword }),
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));

            const result = await response.json();
            console.log("Reset customer password response:", result);

            if (result?.success) {
                toast.success(result?.message || "Password customer berhasil diperbarui");
                setOpen(false);
                setLoading(false);
                setTimeout(() => router.refresh(), 300);
            } else {
                toast.error(result?.message || "Gagal memperbarui password");
                setLoading(false);
            }
        } catch (error: any) {
            console.error("Error resetting customer password:", error);
            if (error?.name === "AbortError") {
                toast.error("Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan");
            } else {
                toast.error("Koneksi gagal. Periksa koneksi internet Anda");
            }
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={openModal}
                >
                    Reset PW
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ubah Password Customer</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-muted-foreground">
                                Password Baru
                            </label>
                            <input
                                id="new_password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-1 p-2 border border-border rounded"
                                required
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={loading}
                        >
                            {loading ? "Menunggu..." : "Simpan"}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ResetCustomer;
