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

const AddAdmin = () => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const openModal = () => {
      setOpen(true);
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            if (!username.trim() || !password.trim() || !name.trim() || !phone.trim()) {
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

            setLoading(true)
        
            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`
            const payload = JSON.stringify({
                username,
                password,
                name,
                phone,
            })    

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

            if (result?.success) {
                toast.success(result?.message || "Admin berhasil ditambahkan")
                setOpen(false)
                setUsername("")
                setPassword("")
                setName("")
                setPhone("")
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                toast.error(result?.message || "Gagal menambahkan admin")
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error adding admin:", error)
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
                <Button variant="default" onClick={() => setOpen(true)}>+ Tambah Admin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Admin Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi admin yang akan ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" placeholder="Contoh: admin01" value={username} type="text" onChange={(e) => setUsername(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" placeholder="Min. 5 karakter" value={password} type="password" onChange={(e) => setPassword(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" placeholder="Contoh: Budi Santoso" value={name} type="text" onChange={(e) => setName(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" name="phone" placeholder="08xxxx" value={phone} type="tel" onChange={(e) => setPhone(e.target.value)} required/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddAdmin;
