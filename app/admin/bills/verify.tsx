"use client"
import { Bills } from "@/app/types"
import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { verifyPayment } from "@/services/bills.admin"
import { Vote } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"


const VerifyBill = ({
   selectedData
}: {
   selectedData: Bills
}) => {


   const router = useRouter()
   const [open, setOpen] = useState<boolean>(false)


   const openModal = () => {
       setOpen(true)
   }


   const handleSubmit = async (e: FormEvent) => {
       try {
           e.preventDefault()

           const result = await verifyPayment(selectedData.payments?.id || 0)
           if (result?.status) {
               toast.success(result.message || "Payment verified successfully")
               setOpen(false)
               setTimeout(() => router.refresh(), 1000)
           } else {
               toast.error(result.message || "Failed to verify payment")
           }
       } catch (error) {
           toast.error(`Something wrong, ${error}`)
       }
   }


   return (
       <AlertDialog open={open} onOpenChange={setOpen}>
           <AlertDialogTrigger asChild>
               <Button variant="outline" className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:opacity-90" onClick={openModal}>
                   <Vote /> Verify
               </Button>
           </AlertDialogTrigger>
           <AlertDialogContent>
               <form onSubmit={handleSubmit}>
                   <AlertDialogHeader>
                       <AlertDialogTitle>Are you sure verify this payment?</AlertDialogTitle>
                       <AlertDialogDescription>
                           This action cannot be undone. This will permanently verify
                           the payment for {selectedData.customer.name}.
                       </AlertDialogDescription>
                   </AlertDialogHeader>
                   <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <Button type="submit">Continue</Button>
                   </AlertDialogFooter>
               </form>
           </AlertDialogContent>
       </AlertDialog>
   )
}
export default VerifyBill