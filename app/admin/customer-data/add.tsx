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

const AddCustomer = () => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [customer_number, setCustomerNumber] = useState<string>("");
    const [service_id, setServiceId] = useState<number>(0);

    const openModal = () => {
      setOpen(true);
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
      setAddress("");
      setCustomerNumber("");
      setServiceId(0);
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            // Validasi input
            if (!username.trim() || !password.trim() || !name.trim() || !phone.trim() || !address.trim() || !customer_number.trim() || service_id === 0) {
                toast.error("Mohon isi semua field dengan benar")
                return
            }

            if (username.length < 3) {
                toast.error("Username minimal 3 karakter")
                return
            }

            if (password.length < 5) {
                toast.error("Password minimal 5 karakter")
                return
            }

            if (phone.length < 10) {
                toast.error("Nomor telepon minimal 10 digit")
                return
            }

            if (customer_number.length < 13) {
                toast.error("NIK minimal 13 digit")
                return
            }

            setLoading(true)
        
            const token = await getCookie("accessToken");
            console.log("Token:", token ? "Found" : "Not found")
            
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`
            const payload = JSON.stringify({
                username,
                password,
                name,
                phone,
                address,
                customer_number,
                service_id,
            })    

            console.log("API URL:", url)
            console.log("Submitting customer:", payload)

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

            console.log("Response status:", response.status)
            console.log("Response ok:", response.ok)

            const result = await response.json()
            console.log("Add customer response:", result)

            if (result?.success) {
                toast.success(result?.message || "Customer berhasil ditambahkan")
                setOpen(false)
                setUsername("")
                setPassword("")
                setName("")
                setPhone("")
                setAddress("")
                setCustomerNumber("")
                setServiceId(0)
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                const errorMsg = result?.message || "Gagal menambahkan customer"
                console.error("API Error:", errorMsg)
                toast.error(errorMsg)
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error adding customer:", error)
            console.error("Error name:", error?.name)
            console.error("Error message:", error?.message)
            
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
                <Button onClick={openModal} variant="default">+ Tambah Customer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Customer Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi pelanggan yang akan ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" placeholder="Contoh: joko" value={username} type="text" onChange={(e) => setUsername(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" placeholder="Min. 5 karakter" value={password} type="password" onChange={(e) => setPassword(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" placeholder="Contoh: Joko Erdana" value={name} type="text" onChange={(e) => setName(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" name="phone" placeholder="08xxxx" value={phone} type="tel" onChange={(e) => setPhone(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="address">Alamat</Label>
                            <Input id="address" name="address" placeholder="Jl. Jalan No. 123" value={address} type="text" onChange={(e) => setAddress(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="customer_number">NIK / No. Customer</Label>
                            <Input id="customer_number" name="customer_number" placeholder="13 digit NIK" value={customer_number} type="text" onChange={(e) => setCustomerNumber(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="service_id">Service ID</Label>
                            <Input id="service_id" name="service_id" placeholder="1" value={service_id} type="number" onChange={(e) => setServiceId(Number(e.target.value))} required/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Customer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCustomer;
