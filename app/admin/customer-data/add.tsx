"use client"

import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Service {
  id: string;
  name: string;
}

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
    const [service_id, setServiceId] = useState<string>("");
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState<boolean>(false);

    const fetchServices = async () => {
        try {
            setLoadingServices(true);
            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali");
                setLoadingServices(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();
            if (result?.data) {
                const servicesData = result.data.map((service: any) => ({
                    id: String(service.id),
                    name: service.name,
                }));
                setServices(servicesData);
            }
        } catch (error: any) {
            console.error("Error fetching services:", error);
        } finally {
            setLoadingServices(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchServices();
        }
    }, [open]);

    const openModal = () => {
      setOpen(true);
      setUsername("");
      setPassword("");
      setName("");
      setPhone("");
      setAddress("");
      setCustomerNumber("");
      setServiceId("");
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            // Validasi input
            if (!username.trim() || !password.trim() || !name.trim() || !phone.trim() || !address.trim() || !customer_number.trim() || !service_id.trim()) {
                console.log("Validation failed:", {
                    username: username.trim(),
                    password: password.trim(),
                    name: name.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    customer_number: customer_number.trim(),
                    service_id: service_id.trim(),
                });
                toast.error("Mohon isi semua field dengan benar, termasuk Service")
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
                service_id: Number(service_id),
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
                setServiceId("")
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
                            <Label htmlFor="service_id">Service</Label>
                            <Select value={service_id} onValueChange={(value) => {
                                console.log("Selected service:", value);
                                setServiceId(value);
                            }}>
                                <SelectTrigger id="service_id" disabled={loadingServices}>
                                    <SelectValue placeholder={loadingServices ? "Memuat service..." : "Pilih Service"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {services && services.length > 0 ? (
                                        services.map((service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-gray-500">Tidak ada service tersedia</div>
                                    )}
                                </SelectContent>
                            </Select>
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
