"use client";

import { Customer } from "@/app/types";
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

const EditCustomer = ({ selectedData }: { selectedData: Customer }) => {
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
    setUsername(selectedData.user.username);
    setPassword("");
    setName(selectedData.name);
    setPhone(selectedData.phone);
    setAddress(selectedData.address);
    setCustomerNumber(selectedData.customer_number);
    setServiceId(selectedData.service_id);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      // Cek minimal ada 1 field yang diubah
      const isUsernameEmpty = !username.trim();
      const isPasswordEmpty = !password.trim();
      const isNameEmpty = !name.trim();
      const isPhoneEmpty = !phone.trim();
      const isAddressEmpty = !address.trim();
      const isCustomerNumberEmpty = !customer_number.trim();
      const isServiceIdEmpty = service_id === 0;

      if (isUsernameEmpty && isPasswordEmpty && isNameEmpty && isPhoneEmpty && isAddressEmpty && isCustomerNumberEmpty && isServiceIdEmpty) {
        toast.error("Mohon ubah minimal satu field");
        return;
      }

      // Validasi hanya untuk field yang di-edit
      if (!isUsernameEmpty && username.length < 3) {
        toast.error("Username minimal 3 karakter");
        return;
      }

      if (!isPasswordEmpty && password.length < 5) {
        toast.error("Password minimal 5 karakter");
        return;
      }

      if (!isPhoneEmpty && phone.length < 10) {
        toast.error("Nomor telepon minimal 10 digit");
        return;
      }

      if (!isCustomerNumberEmpty && customer_number.length < 13) {
        toast.error("NIK minimal 13 digit");
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
      if (!isUsernameEmpty) payload.username = username;
      if (!isPasswordEmpty) payload.password = password;
      if (!isNameEmpty) payload.name = name;
      if (!isPhoneEmpty) payload.phone = phone;
      if (!isAddressEmpty) payload.address = address;
      if (!isCustomerNumberEmpty) payload.customer_number = customer_number;
      if (!isServiceIdEmpty) payload.service_id = service_id;

      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}`;

      console.log("Submitting customer update:", payload);

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
      console.log("Edit customer response:", result);

      if (result?.success) {
        toast.success(result?.message || "Customer berhasil diperbarui");
        setOpen(false);
        setLoading(false);
        setTimeout(() => {
          router.refresh();
        }, 300);
      } else {
        toast.error(result?.message || "Gagal memperbarui customer");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error updating customer:", error);
      if (error?.name === "AbortError") {
        toast.error("Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan");
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
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Ubah field yang ingin diubah. Field lain akan tetap tidak berubah. Minimal harus ada 1 field yang diubah.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="username">Username (Opsional)</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="password">Password (Opsional)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="name">Nama Lengkap (Opsional)</Label>
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
              <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="address">Alamat (Opsional)</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="customer_number">NIK / No. Customer (Opsional)</Label>
              <Input
                id="customer_number"
                name="customer_number"
                type="text"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={customer_number}
                onChange={(e) => setCustomerNumber(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="service_id">Service ID (Opsional)</Label>
              <Input
                id="service_id"
                name="service_id"
                type="number"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                value={service_id || ""}
                onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : 0)}
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

export default EditCustomer;
