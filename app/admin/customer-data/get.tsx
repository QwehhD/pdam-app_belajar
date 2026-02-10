import { Customer } from "@/app/types";
import { getCookie } from "@/lib/server-cookies";

type ResultData = {
    success: boolean,
    message: string,
    data: Customer[]
}


async function getCustomer(): Promise<Customer[]> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`
        
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

export default getCustomer;