"use client";

import { getCookie } from "@/lib/client-cookies";
import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AddPayment = ({ billId }: { billId: number }) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoad, setIsLoad] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!file) {
        toast.warning("Please upload your payment proof first.");
        return;
      }
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`;
      const token = await getCookie("accessToken");
      setIsLoad(true);
      const form = new FormData();
      form.append("bill_id", billId.toString());
      form.append("file", file);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();
      if (result?.success) {
        toast.success(result.message);
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast.warning(result.message);
      }
    } catch (error) {
      toast.error(`Something wrong, ${error}`);
    } finally {
      setIsLoad(false);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Bayar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
              <DialogDescription>
                Please complete your payment and upload the proof here. Click
                save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="file">Usage Value</Label>
                <Input
                  ref={inputRef}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoad}>{isLoad ? "Uploading..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPayment;