import { getCookie } from "@/lib/server-cookies";
import { Services } from "@/app/types";
import AddService from "./add";
import { Dialog } from "@/components/ui/dialog";
import { Search } from "@/components/Search"

type ResultData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}


async function getServices(page:number, quantity:number, search:string): Promise<Services[]> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${quantity}&search=${search}`
        
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
            return {
                success: responseData.success,
                message: rensponseData.message,
                data: [],
                count: 0,
            };
        }
        
        return {
            success: responseData.success,
            message: responseData.success,
            data: responseData.data,
            count: responseData.count,
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
        };
    }

    type Props = {
        searchParams: Promise<{
            page?: number
            quantity?: number
            seach?: string
        }>
    }
}

export default async function ServicesPage (prop: Props)  {
    const services = await getServices();

    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 5
    const search = (await prop.searchParams)?.search || ""
    const {count: counts, data: services} = await getServices(page)
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
                    <div>
                        <Search search= {search ?? ``}/>
                    </div>
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