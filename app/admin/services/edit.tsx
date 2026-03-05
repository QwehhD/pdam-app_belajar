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
  const [isShow, setIsShow] = useState<boolean>(false);
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
      const token = await getCookie("accesstoken");
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`;
      const payload = JSON.stringify({
        name,
        min_usage,
        max_usage,
        price,
      });

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setOpen(false)
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast.warning(result.message);
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={openModal}
            className="bg-pink-500 hover:bg-pink-700 text-white"
          >
            {" "}
            Edit Service
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Fill the form to edit the service.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Service name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </Field>
              <Field>
                <Label htmlFor="min_usage">Min Usage</Label>
                <Input
                  id="min_usage"
                  name="min_usage"
                  type="number"
                  placeholder="0"
                  value={min_usage}
                  onChange={(e) => setMinUsage(Number(e.target.value))}
                />
              </Field>
              <Field>
                <Label htmlFor="max_usage">Max Usage</Label>
                <Input
                  id="max_usage"
                  name="max_usage"
                  type="number"
                  placeholder="0"
                  value={max_usage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditService