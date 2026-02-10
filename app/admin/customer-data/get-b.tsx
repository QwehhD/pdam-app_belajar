import { getCookie } from "@/lib/server-cookies";
import { Customer} from "@/app/types"

type ResultData = {
    success: boolean,
    message: string,
    data: Customer
}

async function getCustomerData(): Promise<Customer | null> {
    try {
        const token = await getCookie('accessToken');

        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`
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

export default getCustomerData;