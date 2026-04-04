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
import { Bills } from "@/app/types";
import { Pencil } from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

interface EditBillsProps {
  selectedData: Bills;
}

const EditBills = ({ selectedData }: EditBillsProps) => {
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
      setCustomers_id(String(selectedData.customer_id));
      setMonth(String(selectedData.month));
      setYear(String(selectedData.year));
      setMeasurement_number(selectedData.measurement_number);
      setUsage_value(String(selectedData.usage_value));
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            setLoading(true)
        
            const token = await getCookie("accessToken");
            
            if (!token) {
                toast.error("Anda tidak terlogin. Silakan login kembali")
                setLoading(false)
                return
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/${selectedData.id}`
            
            // Build payload only with changed fields
            const payload: any = {}
            if (customers_id && customers_id !== String(selectedData.customer_id)) {
                payload.customer_id = Number(customers_id)
            }
            if (month && month !== String(selectedData.month)) {
                payload.month = Number(month)
            }
            if (year && year !== String(selectedData.year)) {
                payload.year = Number(year)
            }
            if (measurement_number && measurement_number !== selectedData.measurement_number) {
                payload.measurement_number = measurement_number
            }
            if (usage_value && usage_value !== String(selectedData.usage_value)) {
                payload.usage_value = Number(usage_value)
            }    

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId))

            const result = await response.json()

            if (result?.success) {
                toast.success(result?.message || "Tagihan berhasil diperbarui")
                setOpen(false)
                setLoading(false)
                setTimeout(() => {
                    router.refresh()
                }, 300)
            } else {
                const errorMsg = result?.message || "Gagal memperbarui tagihan"
                toast.error(errorMsg)
                setLoading(false)
            }

        } catch (error: any) {
            console.error("Error updating bill:", error)
            
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
                    onClick={openModal} 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Tagihan</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi tagihan yang dipilih
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="service_id">Pilih Customer</Label>
                            <Select value={customers_id} onValueChange={(value) => setCustomers_id(value)}>
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
                            <Input id="month" name="month" placeholder="01-12" value={month} type="number" onChange={(e) => setMonth(e.target.value)} />
                        </Field>
                        <Field>
                            <Label htmlFor="year">Tahun</Label>
                            <Input id="year" name="year" placeholder="2024" value={year} type="number" onChange={(e) => setYear(e.target.value)} />
                        </Field>
                        <Field>
                            <Label htmlFor="measurement_number">Nomor Pengukuran</Label>
                            <Input id="measurement_number" name="measurement_number" placeholder="Nomor pengukuran" value={measurement_number} type="text" onChange={(e) => setMeasurement_number(e.target.value)} />
                        </Field>
                        <Field>
                            <Label htmlFor="usage_value">Nilai Pemakaian</Label>
                            <Input id="usage_value" name="usage_value" placeholder="Nilai pemakaian" value={usage_value} type="text" onChange={(e) => setUsage_value(e.target.value)} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditBills;
