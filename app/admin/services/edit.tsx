"use client";

import { Services } from "@/app/types";
import { getCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";

const EditService = ({ selectedData }: { selectedData: Services }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [min_usage, setMinUsage] = useState<number>(0);
  const [max_usage, setMaxUsage] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const openModal = () => {
    setOpen(true);
    setName(selectedData.name);
    setMinUsage(selectedData.min_usage);
    setMaxUsage(selectedData.max_usage);
    setPrice(selectedData.price);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      // Cek minimal ada 1 field yang diubah / tidak kosong
      const isNameEmpty = !name.trim();
      const isPriceEmpty = price === undefined || price === null;
      const isMinEmpty = min_usage === undefined || min_usage === null;
      const isMaxEmpty = max_usage === undefined || max_usage === null;

      // Izinkan update jika minimal ada satu field yang terisi
      if (isNameEmpty && isPriceEmpty && isMinEmpty && isMaxEmpty) {
        toast.error("Mohon ubah minimal satu field");
        return;
      }

      // Validasi hanya untuk field yang di-edit (diisi)
      if (!isNameEmpty && name.trim().length < 3) {
        toast.error("Nama service minimal 3 karakter");
        return;
      }

      if (!isMinEmpty && !isMaxEmpty && min_usage >= max_usage) {
        toast.error("Penggunaan minimum harus lebih kecil dari maksimal");
        return;
      }

      setLoading(true);

      const token = await getCookie("accessToken");
      if (!token) {
        toast.error("Anda tidak terlogin. Silakan login kembali");
        setLoading(false);
        return;
      }

      // Build payload dengan hanya field yang diubah
      const payload: any = {};
      if (!isNameEmpty) payload.name = name;
      if (!isPriceEmpty) payload.price = price;
      if (!isMinEmpty) payload.min_usage = min_usage;
      if (!isMaxEmpty) payload.max_usage = max_usage;

      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`;

      console.log("Submitting service update:", payload);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      const result = await response.json();
      console.log("Edit service response:", result);

      if (result?.success) {
        toast.success(result?.message || "Service berhasil diperbarui");
        setOpen(false);
        setLoading(false);
        setTimeout(() => {
          router.refresh();
        }, 300);
      } else {
        toast.error(result?.message || "Gagal memperbarui service");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error updating service:", error);
      if (error?.name === "AbortError") {
        toast.error(
          "Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan"
        );
      } else {
        toast.error("Koneksi gagal. Periksa koneksi internet Anda");
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Edit Service
        </Button>
      </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Ubah field yang ingin diubah. Field lain akan tetap tidak berubah. Minimal harus ada 1 field yang diubah.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Nama Service (Opsional)</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="price">Harga (Rp) (Opsional)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
                />
              </Field>
              <Field>
                <Label htmlFor="min_usage">Penggunaan Minimum (m³) (Opsional)</Label>
                <Input
                  id="min_usage"
                  name="min_usage"
                  type="number"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                  value={min_usage || ""}
                  onChange={(e) => setMinUsage(e.target.value ? Number(e.target.value) : 0)}
                />
              </Field>
              <Field>
                <Label htmlFor="max_usage">Penggunaan Maksimal (m³) (Opsional)</Label>
                <Input
                  id="max_usage"
                  name="max_usage"
                  type="number"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                  value={max_usage || ""}
                  onChange={(e) => setMaxUsage(e.target.value ? Number(e.target.value) : 0)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

export default EditService;