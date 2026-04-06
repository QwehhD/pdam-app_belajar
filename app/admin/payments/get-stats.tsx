import { Payments } from "@/app/types";
import { getCookie } from "@/lib/server-cookies";

export interface PaymentsStats {
    total: number;
    verified: number;
    pending: number;
}

async function getPaymentsStats(): Promise<PaymentsStats> {
    try {
        const token = await getCookie('accessToken');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        
        const fetchWithTimeout = (url: string, timeout: number = 8000) => {
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

        // Ambil semua data payments
        const response = await fetchWithTimeout(`${baseUrl}/payments?page=1&quantity=10000`);
        const result = await response.json();
        
        const payments: Payments[] = result?.data || [];
        
        // Hitung manual berdasarkan field verified
        const verifiedCount = payments.filter((payment) => payment.verified === true).length;
        const pendingCount = payments.filter((payment) => payment.verified === false).length;

        return {
            total: payments.length,
            verified: verifiedCount,
            pending: pendingCount
        };

    } catch (error) {
        console.error('Error fetching payments stats:', error);
        return {
            total: 0,
            verified: 0,
            pending: 0
        };
    }
}

export default getPaymentsStats;
