"use client"

import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AddService = () => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [min_usage, setMinUsage] = useState<number>(0);
    const [max_usage, setMaxUsage] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // const openModal = (
    //     alert("Modal Clicked"),
    //     setIsShow(true),
    //     setName(""),
    //     setMinUsage(0),
    //     setMaxUsage(0),
    //     setPrice(0)
    // )

    const openModal = () => {
      setOpen(true);
      setName("");
      setMinUsage(0);
      setMaxUsage(0);
      setPrice(0);
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            // Validasi input
            if (!name.trim() || min_usage < 0 || max_usage < 0 || price < 0) {
                toast.error("Mohon isi semua field dengan benar")
                return
            }

            if (min_usage >= max_usage) {
                toast.error("Penggunaan minimum harus lebih kecil dari maksimal")
                return
            }

            setLoading(true)
        
            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`
            const payload = JSON.stringify({
                name,
                min_usage,
                max_usage,
                price,
            })    

            console.log("Submitting service:", payload)

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                body: payload,
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId))

            const result = await response.json()
            console.log("Add service response:", result)

            if (result?.success) {
                toast.success(result?.message || "Service berhasil ditambahkan")
                setOpen(false)
                setName("")
                setMinUsage(0)
                setMaxUsage(0)
                setPrice(0)
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                toast.error(result?.message || "Gagal menambahkan service")
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error adding service:", error)
            if (error?.name === 'AbortError') {
                toast.error("Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan")
            } else {
                toast.error("Koneksi gagal. Periksa koneksi internet Anda")
            }
            setLoading(false)
        }
        
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={openModal} variant="default">+ Tambah Service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Service Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi layanan yang akan ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Nama Service</Label>
                            <Input id="name" name="name" placeholder="Contoh: Paket Hemat" value={name} type="text" onChange={(e) => setName(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="min-usage">Penggunaan Minimum (m³)</Label>
                            <Input id="min-usage" name="min-usage" placeholder="0" value={min_usage} type="number" onChange={(e) => setMinUsage(Number(e.target.value))} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="max-usage">Penggunaan Maksimal (m³)</Label>
                            <Input id="max-usage" name="max-usage" placeholder="10" value={max_usage} type="number" onChange={(e) => setMaxUsage(Number(e.target.value))} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input id="price" name="price" placeholder="50000" value={price} type="number" onChange={(e) => setPrice(Number(e.target.value))} required/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Service"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddService;
