"use client";

import { Admin } from "@/app/types";
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

const EditAdmin = ({ selectedData }: { selectedData: Admin }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const openModal = () => {
    setOpen(true);
    setUsername(selectedData.user.username);
    setPassword("");
    setName(selectedData.name);
    setPhone(selectedData.phone);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const isUsernameEmpty = !username.trim();
      const isPasswordEmpty = !password.trim();
      const isNameEmpty = !name.trim();
      const isPhoneEmpty = !phone.trim();

      if (isUsernameEmpty && isPasswordEmpty && isNameEmpty && isPhoneEmpty) {
        toast.error("Mohon ubah minimal satu field");
        return;
      }

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

      setLoading(true);

      const token = await getCookie("accessToken");
      if (!token) {
        toast.error("Anda tidak terlogin. Silakan login kembali");
        setLoading(false);
        return;
      }

      const payload: any = {};
      if (!isUsernameEmpty) payload.username = username;
      if (!isPasswordEmpty) payload.password = password;
      if (!isNameEmpty) payload.name = name;
      if (!isPhoneEmpty) payload.phone = phone;

      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`;

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
      console.log("Edit admin response:", result);

      if (result?.success) {
        toast.success(result?.message || "Admin berhasil diperbarui");
        setOpen(false);
        setLoading(false);
        setTimeout(() => {
          router.refresh();
        }, 300);
      } else {
        toast.error(result?.message || "Gagal memperbarui admin");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error updating admin:", error);
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
            <DialogTitle>Edit Admin</DialogTitle>
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
  );
};

export default EditAdmin;
