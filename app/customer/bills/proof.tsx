"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function PaymentProofPreview({filename}: {filename: string}) {
    const src = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payment-proof/${filename}`
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    lihat Bukti 
                </Button> 
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Payment Proof</DialogTitle>
                    <DialogDescription>
                        This is a preview of the payment proof. {src}
                    </DialogDescription>
                </DialogHeader>
                <img src ={src} alt="proof" className="rounded-md"/>
            </DialogContent>
        </Dialog>
    )
}