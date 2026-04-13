// import { Bills } from "@/app/types";
// import { getCookie } from "@/lib/server-cookies";

// export interface CustomerBillsResult {
//     success: boolean
//     message: string
//     data: Bills[]
//     count: number
// }

// async function getCustomerBills(page: number = 1, quantity: number = 100, search: string = ""): Promise<CustomerBillsResult> {
//     try {
//         const token = await getCookie('accessToken');
//         const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me?page=${page}&quantity=${quantity}&search=${search}`
        
//         const fetchWithTimeout = (timeout: number = 8000) => {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), timeout);
            
//             return fetch(url, {
//                 method: "GET",
//                 headers: {
//                     "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//                 signal: controller.signal
//             }).finally(() => clearTimeout(timeoutId));
//         };

//         const response = await fetchWithTimeout();
//         const responseData = await response.json()

//         if (!response.ok) {
//             console.log(responseData?.message)
//             return {
//                 success: responseData.success ?? false,
//                 message: responseData.message ?? "Failed to fetch bills",
//                 data: [],
//                 count: 0,
//             };
//         }
        
//         return {
//             success: responseData.success ?? true,
//             message: responseData.message ?? "Success",
//             data: responseData.data ?? [],
//             count: responseData.count ?? 0,
//         }

//     } catch (error: any) {
//         if (error?.name === 'AbortError') {
//             console.error('Request timeout - API took too long to respond');
//         } else {
//             console.error('Error fetching customer bills:', error);
//         }
//         return {
//             success: false,
//             message: "Error fetching bills",
//             data: [],
//             count: 0
//         };
//     }
// }

// export default getCustomerBills;

