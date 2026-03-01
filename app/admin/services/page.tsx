import { getCookie } from "@/lib/server-cookies";
import { Services } from "@/app/types";
import AddService from "./add";
import { Dialog } from "@/components/ui/dialog";

type ResultData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}


async function getServices(): Promise<Services[]> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`
        
        const response = await fetch(url, 
            {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store"
            }
        );

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return [];
        }
        
        return responseData.data

    } catch (error) {
        console.log(error)
        return [];
    }
}

export default async function ServicesPage ()  {
    const services = await getServices();
    return (
        <div>
            <h1>Service Page</h1>
            <div>
                <AddService/>
                <Dialog/>
            </div>
            {
                services.length == 0 ? "Data Service Tidak Ada" :
                    <div>
                        {services.map((service) => {
                            return (
                                <div key={service.id}>
                                    <h2>Nama : {service.name}</h2>
                                    <p>Layanan</p>
                                    <p>{service.min_usage} - {service.max_usage}</p>
                                </div>
                            )
                        })
                        }
                    </div>
            }
            <EditService selectedData={service}/>
        </div>
    
    )
}