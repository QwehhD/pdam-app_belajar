"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Filter } from "lucide-react"

interface FilterStatusProps {
    currentFilter: string
}

const FilterStatus = ({ currentFilter }: FilterStatusProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value === "") {
            params.delete("paid")
        } else {
            params.set("paid", value)
        }
        
        // Reset to page 1 when filtering
        params.set("page", "1")
        
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilter("")}
                    className={`h-8 px-3 rounded-md text-xs font-medium transition-all ${
                        currentFilter === "" 
                            ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" 
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                    Semua
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilter("true")}
                    className={`h-8 px-3 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                        currentFilter === "true" 
                            ? "bg-green-500 text-white shadow-sm hover:bg-green-600" 
                            : "text-slate-500 hover:text-green-600 dark:hover:text-green-400"
                    }`}
                >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Lunas
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilter("false")}
                    className={`h-8 px-3 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                        currentFilter === "false" 
                            ? "bg-red-500 text-white shadow-sm hover:bg-red-600" 
                            : "text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                    }`}
                >
                    <XCircle className="h-3.5 w-3.5" />
                    Belum Bayar
                </Button>
            </div>
        </div>
    )
}

export default FilterStatus
