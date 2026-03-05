import { getCookie } from "@/lib/server-cookies";
import { Services } from "@/app/types";
import AddService from "./add";
import EditService from "./edit";
import DeleteService from "./delete";
import DetailService from "./detail";
import { Card } from "@/components/ui/card";
import Search from "@/components/Search"
import SimplePagination from "@/components/Pagination"
import WarningToast from "@/components/WarningToast"

type ResultData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

async function getServices(page:number, quantity:number, search:string): Promise<ResultData> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`
        
        // Fetch dengan timeout yang lebih aman
        const fetchWithTimeout = (timeout: number = 8000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            return fetch(url, {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store",
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
        };

        const response = await fetchWithTimeout();

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return {
                success: responseData.success,
                message: responseData.message,
                data: [],
                count: 0,
            };
        }
        
        return {
            success: responseData.success,
            message: responseData.message,
            data: responseData.data,
            count: responseData.count,
        }

    } catch (error: any) {
        if (error?.name === 'AbortError') {
            console.error('Request timeout - API took too long to respond');
        } else {
            console.error('Error fetching services:', error);
        }
        return {
            success: false,
            message: "Error fetching services",
            data: [],
            count: 0
        };
    }
}

export default async function ServicesPage (prop: Props)  {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 5
    const search = (await prop.searchParams)?.search || ""
    const result = await getServices(page, quantity, search)
    const {count: counts, data: services, success, message} = result
    
    return (
        <div className="container mx-auto py-10 px-4">
            <WarningToast success={success} message={message} isEmpty={services.length === 0 && success} />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daftar Service</h1>
                    <p className="text-muted-foreground">Kelola paket layanan Anda di sini.</p>
                </div>
                
                <AddService />
            </div>

            {!success && services.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-lg font-medium text-red-600">⚠️ Gagal Memuat Data</p>
                    <p className="text-sm text-muted-foreground mt-2">{message || "Tidak bisa terhubung ke server. Silakan coba lagi."}</p>
                </Card>
            ) : services.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-lg font-medium">Belum Ada Service</p>
                    <p className="text-sm text-muted-foreground">Mulai tambahkan service pertama Anda</p>
                </Card>
            ) : (
                <div>
                    <div className="mb-6">
                        <Search search={search ?? ``}/>
                    </div>
                    <div className="space-y-4">
                        {services.map((service) => (
                            <Card key={service.id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold">{service.name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Penggunaan: {service.min_usage} - {service.max_usage} m³
                                        </p>
                                        <p className="text-lg font-bold text-green-600 mt-2">Rp {service.price?.toLocaleString('id-ID') || '0'}/bulan</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailService selectedData={service}/>
                                        <EditService selectedData={service}/>
                                        <DeleteService selectedData={service}/>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="mt-8">
                        <SimplePagination count={counts} perPage={quantity} currentPages={page} />
                    </div>
                </div>
            )}
        </div>
    )
}