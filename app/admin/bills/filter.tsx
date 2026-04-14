"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

export default function StatusFilter() {
   const router = useRouter()
   const searchParams = useSearchParams()

   const currentStatus = searchParams.get("status") || "all"

   const handleChange = (value: string) => {
       const params = new URLSearchParams(searchParams.toString())
       params.set("status", value)
       params.set("page", "1")

       router.push(`?${params.toString()}`)
   }

   const statusLabels: Record<string, string> = {
       all: "Semua",
       unpaid: "Belum Bayar",
       pending: "Menunggu Verifikasi",
       paid: "Lunas"
   }

   return (
       <div className="relative inline-block w-full md:w-auto">
           <select
               value={currentStatus}
               onChange={(e) => handleChange(e.target.value)}
               className="w-full md:w-48 px-4 py-2 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white cursor-pointer appearance-none hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
           >
               <option value="all">Semua</option>
               <option value="unpaid">Belum Bayar</option>
               <option value="pending">Menunggu Verifikasi</option>
               <option value="paid">Lunas</option>
           </select>
           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
       </div>
   )
}
