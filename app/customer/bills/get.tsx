import { getCookie } from "@/lib/server-cookies";

export interface CustomerPayment {
    id: number
    bill_id: number
    payment_date: string
    verified: boolean
    total_amount: number
    payment_proof: string
    owner_token: string
    createdAt: string
    updatedAt: string
    bill?: {
        id: number
        customer_id: number
        admin_id: number
        month: number
        year: number
        measurement_number: string
        usage_value: number
        price: number
        service_id: number
        paid: boolean
        owner_token: string
        createdAt: string
        updatedAt: string
        admin?: {
            id: number
            user_id: number
            name: string
            phone: string
        }
        customer?: {
            id: number
            user_id: number
            customer_number: string
            name: string
            phone: string
            address: string
            service_id: number
        }
        service?: {
            id: number
            name: string
            min_usage: number
            max_usage: number
            price: number
        }
    }
}

export interface CustomerPaymentsResult {
    success: boolean
    message: string
    data: CustomerPayment[]
    count: number
}

async function getCustomerPayments(page: number = 1, quantity: number = 100, search: string = ""): Promise<CustomerPaymentsResult> {
    try {
        const token = await getCookie('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/me?page=${page}&quantity=${quantity}&search=${search}`
        
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
        const responseData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return {
                success: responseData.success ?? false,
                message: responseData.message ?? "Failed to fetch bills",
                data: [],
                count: 0,
            };
        }
        
        return {
            success: responseData.success ?? true,
            message: responseData.message ?? "Success",
            data: responseData.data ?? [],
            count: responseData.count ?? 0,
        }

    } catch (error: any) {
        if (error?.name === 'AbortError') {
            console.error('Request timeout - API took too long to respond');
        } else {
            console.error('Error fetching customer payments:', error);
        }
        return {
            success: false,
            message: "Error fetching payments",
            data: [],
            count: 0
        };
    }
}

export default getCustomerPayments;
