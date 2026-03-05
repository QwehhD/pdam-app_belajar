'use client'

import { Services } from "@/app/types"
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

interface DetailServiceProps {
    selectedData: Services
}

export default function DetailService({ selectedData }: DetailServiceProps) {
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
                    <DialogTitle>Detail Service</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap paket layanan
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Nama Paket</label>
                        <p className="text-sm font-medium">{selectedData.name}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Penggunaan Minimum</label>
                        <p className="text-sm font-medium">{selectedData.min_usage} m³</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Penggunaan Maksimum</label>
                        <p className="text-sm font-medium">{selectedData.max_usage} m³</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">Harga</label>
                        <p className="text-lg font-bold text-green-600">Rp {selectedData.price?.toLocaleString('id-ID') || '0'}/bulan</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">ID Service</label>
                        <p className="text-xs text-muted-foreground">{selectedData.id}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
