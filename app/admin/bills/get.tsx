import { Bills } from "@/app/types";
import { getCookie } from "@/lib/server-cookies";

type ResultData = {
    success: boolean,
    message: string,
    data: Bills[],
    count: number
}

export interface BillsResult {
    success: boolean
    message: string
    data: Bills[]
    count: number
}

async function getBills(page: number = 1, quantity: number = 9, search: string = ""): Promise<BillsResult> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills?page=${page}&quantity=${quantity}&search=${search}`
        
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
            console.error('Error fetching bills:', error);
        }
        return {
            success: false,
            message: "Error fetching bills",
            data: [],
            count: 0
        };
    }
}

export default getBills;