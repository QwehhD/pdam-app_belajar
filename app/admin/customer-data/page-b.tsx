import { getCookie } from "@/lib/server-cookies";
import { Customer } from "@/app/types";
// import AddService from "./add";
import { Dialog } from "@/components/ui/dialog";
import getCustomer from "./get";

export default async function ServicesPage ()  {
    const customer = await getCustomer();
    return (
        <div>
            <h1>Customer Page</h1>
            <div>
                {/* <AddService/> */}
                <Dialog/>
            </div>
            {
                customer.length == 0 ? "Data Customer Tidak Ada" :
                    <div>
                        {customer.map((customer) => {
                            return (
                                <div key={customer.id}>
                                    <h2>Nama : {customer.user.username}</h2>
                                    <p>Layanan</p>
                                    <p>{customer.phone} - {customer.address}</p>
                                </div>
                            )
                        })
                        }
                    </div>
            }
        </div>
    
    )
}