"use client"


import { Bills } from "@/app/types"
import { Button } from "@/components/ui/button"


export default function BillDetailClient({ data }: { data: Bills }) {


   const handlePrint = () => {
       window.print()
   }


   const monthName = new Date(
       data.year,
       data.month - 1
   ).toLocaleString("id-ID", {
       month: "long",
   })


   // ✅ STATUS LOGIC
   const getStatus = () => {
       if (!data.payments) return {
           label: "BELUM BAYAR",
           color: "text-red-600 border-red-600"
       }
       if (!data.payments.verified) return {
           label: "MENUNGGU VERIFIKASI",
           color: "text-yellow-600 border-yellow-600"
       }
       return {
           label: "LUNAS",
           color: "text-green-600 border-green-600"
       }
   }


   const status = getStatus()


   return (
       <div className="p-6 bg-gray-50 min-h-screen">


           {/* ACTION */}
           <div className="mb-4 flex justify-end print:hidden">
               <Button onClick={handlePrint}>Cetak PDF</Button>
           </div>


           {/* INVOICE */}
           <div className="mx-auto max-w-2xl bg-white shadow-lg rounded-xl border p-6">


               {/* HEADER */}
               <div className="flex justify-between items-start border-b pb-4 mb-6">
                   <div>
                       <h1 className="text-2xl font-bold text-primary">
                           PDAM
                       </h1>
                       <p className="text-sm text-muted-foreground">
                           Bukti Pembayaran Air
                       </p>
                   </div>


                   {/* STATUS BADGE */}
                   <div className={`px-3 py-1 border rounded-full text-xs font-semibold ${status.color}`}>
                       {status.label}
                   </div>
               </div>


               {/* INFO */}
               <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                   <div>
                       <p className="text-muted-foreground">No Invoice</p>
                       <p className="font-medium">#{data.id}</p>
                   </div>


                   <div className="text-right">
                       <p className="text-muted-foreground">Tanggal Bayar</p>
                       <p className="font-medium">
                           {data.payments?.payment_date
                               ? new Date(data.payments.payment_date).toLocaleDateString("id-ID")
                               : "-"}
                       </p>
                   </div>
               </div>


               {/* CUSTOMER */}
               <div className="mb-6 bg-slate-50 p-4 rounded-lg text-sm">
                   <p className="font-semibold">{data.customer?.name}</p>
                   <p>{data.customer?.address}</p>
                   <p className="text-muted-foreground">
                       Layanan: {data.service.name}
                   </p>
                   <p className="text-muted-foreground">
                       No Pelanggan: {data.customer?.customer_number}
                   </p>
               </div>


               {/* TABLE STYLE */}
               <div className="mb-6">
                   <div className="grid grid-cols-2 border-b py-3 text-sm">
                       <span>Periode</span>
                       <span className="text-right">
                           {monthName} {data.year}
                       </span>
                   </div>


                   <div className="grid grid-cols-2 border-b py-3 text-sm">
                       <span>Pemakaian</span>
                       <span className="text-right">
                           {data.usage_value} m³
                       </span>
                   </div>


                   <div className="grid grid-cols-2 border-b py-3 text-sm">
                       <span>Harga / m³</span>
                       <span className="text-right">
                           Rp {data.price.toLocaleString("id-ID")}
                       </span>
                   </div>


                   <div className="grid grid-cols-2 py-3 text-lg font-bold">
                       <span>Total Pembayaran</span>
                       <span className="text-right text-primary">
                           Rp {(data.payments?.total_amount || data.amount).toLocaleString("id-ID")}
                       </span>
                   </div>
               </div>


               {/* FOOTER */}
               <div className="text-center text-xs text-muted-foreground border-t pt-4">
                   <p>Terima kasih telah melakukan pembayaran</p>
                   <p>PDAM Kota</p>
               </div>


           </div>
       </div>
   )
}
