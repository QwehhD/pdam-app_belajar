"use client"

import { getCookie } from "cookies-next";
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

const AddService = () => {
    const router = useRouter();

    const [isShow, setIsShow] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [min_usage, setMinUsage] = useState<number>(0);
    const [max_usage, setMaxUsage] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // const openModal = (
    //     alert("Modal Clicked"),
    //     setIsShow(true),
    //     setName(""),
    //     setMinUsage(0),
    //     setMaxUsage(0),
    //     setPrice(0)
    // )

    const openModal = () => {
    
      alert("Modal Clicked");
      setIsShow(true);
      setOpen(true);
    setName("");
    setMinUsage(0);
    setMaxUsage(0);
    setPrice(0);
};

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
        
        const token = await getCookie("accessToken");
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`
        const payload = JSON.stringify({
            name,
            min_usage,
            max_usage,
            price,
        })    

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`,
            },
            body: payload
        })

        const result = await response.json()
        if (result?.success) {
            setIsShow(false)
            toast.success(result?.message)
            setTimeout(() =>
                router.refresh(), 1000)
        } else {
            toast.warning(result?.message)
            }

        } catch (error) {1
            toast.error("Something went wrong")
        }
        
    }
    return (
        <div>
            <div>
                <Dialog open=(open)>
        <DialogTrigger asChild>
          <Button onClick = {openModal} variant="default">Add Service</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
    <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Service Data</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* defaultValue=  for place holder*/}
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Service Name" value={name} type="text" onChange={(e) => setName(e.target.value)}/>
            </Field>
            <Field>
              <Label htmlFor="min-usage">Minimum Usage</Label>
              <Input id="min-usage" name="min-usage" placeholder="Minimum Usage" value={min_usage} type="number" onChange={(e) => setMinUsage(Number(e.target.value))}/>
            </Field>
            <Field>
              <Label htmlFor="max-usage">Maximum Usage</Label>
              <Input id="max-usage" name="max-usage" placeholder="Maximum Usage" value={max_usage} type="number" onChange={(e) => setMaxUsage(Number(e.target.value))}/>
            </Field>
            <Field>
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" placeholder="Price" value={price} type="number" onChange={(e) => setPrice(Number(e.target.value))}/>
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
        </div>
        
    )
}

export default AddService;