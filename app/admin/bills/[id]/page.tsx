import { getBillById } from "@/services/bills.admin"
import BillDetailClient from "./detail"


export default async function BillDetail({ params }: {params: Promise<{ id: string }>}) {
 const { id } = await params
 const billId = Number(id)


 const data = await getBillById(billId)


 return <BillDetailClient data={data} />
}
