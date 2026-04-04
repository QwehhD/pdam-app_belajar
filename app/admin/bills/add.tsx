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

interface Customer {
  id: string;
  name: string;
}

const AddBills = () => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [customers_id, setCustomers_id] = useState<string>("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [month, setMonth] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [measurement_number, setMeasurement_number] = useState<string>("");
    const [usage_value, setUsage_value] = useState<string>("");
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);

    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);
            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali");
                setLoadingCustomers(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`,
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
                const customersData = result.data.map((customer: any) => ({
                    id: String(customer.id),
                    name: customer.name,
                }));
                setCustomers(customersData);
            }
        } catch (error: any) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCustomers();
        }
    }, [open]);

    const openModal = () => {
      setOpen(true);
      setCustomers_id("");
      setMonth("");
      setYear("");
      setMeasurement_number("");
      setUsage_value("");
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            // Validasi input
            if (!customers_id.trim() || !month.trim() || !year.trim() || !measurement_number.trim() || !usage_value.trim()) {
                console.log("Validation failed:", {
                    customers_id: customers_id.trim(),
                    month: month.trim(),
                    year: year.trim(),
                    measurement_number: measurement_number.trim(),
                    usage_value: usage_value.trim(),
                });
                toast.error("Mohon isi semua field dengan benar")
                return
            }

            // if (username.length < 3) {
            //     toast.error("Username minimal 3 karakter")
            //     return
            // }

            if (month.length > 2 || Number(month) < 1 || Number(month) > 12) {
                toast.error("Bulan tidak valid")
                return
            }

            if (year.length !== 4 || Number(year) < 1000 || Number(year) > 9999) {
                toast.error("Tahun tidak valid")
                return
            }

            // if (measurement_number.length < 10) {
            //     toast.error("Nomor pengukuran minimal 10 digit")
            //     return
            // }

            // if (usage_value.length < 5) {
            //     toast.error("Nilai pemakaian minimal 5 digit")
            //     return
            // }

            setLoading(true)
        
            const token = await getCookie("accessToken");
            console.log("Token:", token ? "Found" : "Not found")
            
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills`
            const payload = JSON.stringify({
                customers_id: Number(customers_id),
                month,
                year,
                measurement_number,
                usage_value
            })    

            console.log("API URL:", url)
            console.log("Submitting bill:", payload)

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
            console.log("Add bill response:", result)

            if (result?.success) {
                toast.success(result?.message || "Tagihan berhasil ditambahkan")
                setOpen(false)
                setCustomers_id("")
                setMonth("")
                setYear("")
                setMeasurement_number("")
                setUsage_value("")
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                const errorMsg = result?.message || "Gagal menambahkan tagihan"
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
                <Button onClick={openModal} variant="default">+ Tambah Tagihan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Tagihan Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi tagihan yang akan ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="service_id">Pilih Customer</Label>
                            <Select value={customers_id} onValueChange={(value) => {
                                console.log("Selected customer:", value);
                                setCustomers_id(value);
                            }}>
                                <SelectTrigger id="service_id" disabled={loadingCustomers}>
                                    <SelectValue placeholder={loadingCustomers ? "Memuat customer..." : "Pilih Customer"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers && customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-gray-500">Tidak ada customer tersedia</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="month">Bulan</Label>
                            <Input id="month" name="month" placeholder="01-12" value={month} type="number" min="1" max="12" onChange={(e) => setMonth(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="year">Tahun</Label>
                            <Input id="year" name="year" placeholder="2024" value={year} type="number" onChange={(e) => setYear(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="measurement_number">Nomor Pengukuran</Label>
                            <Input id="measurement_number" name="measurement_number" placeholder="Min. 10 digit" value={measurement_number} type="text" onChange={(e) => setMeasurement_number(e.target.value)} required/>
                        </Field>
                        <Field>
                            <Label htmlFor="usage_value">Nilai Pemakaian</Label>
                            <Input id="usage_value" name="usage_value" placeholder="Min. 5 digit" value={usage_value} type="text" onChange={(e) => setUsage_value(e.target.value)} required/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Tagihan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddBills;
