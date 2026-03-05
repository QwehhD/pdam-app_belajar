'use client'

import { Customer } from "@/app/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface DetailCustomerProps {
    selectedData: Customer
}

export default function DetailCustomer({ selectedData }: DetailCustomerProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Detail
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Customer</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap pelanggan
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Nama</label>
                        <p className="text-sm font-medium">{selectedData.name}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Username</label>
                        <p className="text-sm font-medium">@{selectedData.user.username}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">No. Telepon</label>
                        <p className="text-sm font-medium">{selectedData.phone}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Alamat</label>
                        <p className="text-sm font-medium leading-relaxed">{selectedData.address}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">No. Customer (NIK)</label>
                        <p className="text-sm font-medium">{selectedData.customer_number}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">ID Layanan</label>
                        <p className="text-sm font-medium">{selectedData.service_id}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">ID Customer</label>
                        <p className="text-sm font-medium text-xs text-muted-foreground">{selectedData.id}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
