import { Customer, Services } from "@/app/types"
import Search from "@/components/Search";
import { getCookie } from "@/lib/server-cookies";

type ResultData = {
    success: boolean,
    message: string,
    data: Customer
}

type ServiceData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}

async function getCustomerProfile(): Promise<Customer | null> {
    try {
        const token = await getCookie('accessToken');

        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/me`
        const response = await fetch(url, 
            {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                }
            }
        )

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return null
        }
        
        return responseData.data

    } catch (error) {
        console.log(error)
        return null
    }
}

async function getServices(search: string = ""): Promise<Services[]> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?quantity=1000&search=${search}`;
    
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const responseData: ServiceData = await response.json();

        if (!response.ok) {
            console.log(responseData.message);
            return [];
        }
        return responseData.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

type Props = {
    searchParams: Promise<{
        search?: string,
    }>
}

export default async function DashboardCustomer(prop: Props) {
    const search = (await prop.searchParams)?.search || ""
    const customerData = await getCustomerProfile()
    const services = await getServices(search);
    
    if (customerData == null) {
        return  (
            <div className="w-full p-5">
                Sorry, customer data does not exist.
            </div>
        )
    }

    return (
        <div className="w-full p-5 space-y-6">
            {/* Customer Profile Section */}
            <div className="w-full p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg shadow-md border border-sky-200">
                <h1 className="font-bold text-sky-600 text-2xl mb-4">👤 Customer Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Name</span>
                        <span className="text-gray-900">: {customerData.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Username</span>
                        <span className="text-gray-900">: {customerData.user.username}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Phone</span>
                        <span className="text-gray-900">: {customerData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Customer Number</span>
                        <span className="text-gray-900">: {customerData.customer_number}</span>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Address</span>
                        <span className="text-gray-900">: {customerData.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700 min-w-32">Sign In Date</span>
                        <span className="text-gray-900">: {new Date(customerData.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-sky-600 text-2xl">⚙️ Available Services</h1>
                </div>
                
                {/* Search Bar with Button */}
                <div className="w-full">
                    <Search search={search ?? ``}/>
                </div>

                {/* Services List */}
                {services.length === 0 ? (
                    <div className="w-full p-8 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                        <p className="text-yellow-800 font-semibold text-lg">⚠️ Layanan tidak ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => {
                            return (
                                <div 
                                    key={service.id}
                                    className="p-5 bg-white rounded-lg shadow-md border-l-4 border-sky-500 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="space-y-3">
                                        <h2 className="font-bold text-lg text-sky-600">{service.name}</h2>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <span className="font-semibold">Range Penggunaan :</span>
                                        </div>
                                        <div className="bg-sky-50 p-3 rounded-md border border-sky-100">
                                            <p className="text-gray-900 font-semibold">
                                                {service.min_usage} - {service.max_usage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}