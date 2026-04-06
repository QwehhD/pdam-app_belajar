import { Bills } from "@/app/types";
import { getCookie } from "@/lib/server-cookies";

export interface BillsStats {
    total: number;
    paid: number;
    unpaid: number;
}

async function getBillsStats(): Promise<BillsStats> {
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

        // Ambil semua data tagihan (tanpa pagination limit)
        const response = await fetchWithTimeout(`${baseUrl}/bills?page=1&quantity=10000`);
        const result = await response.json();
        
        const bills: Bills[] = result?.data || [];
        
        // Hitung manual berdasarkan field paid
        const paidCount = bills.filter((bill) => bill.paid === true).length;
        const unpaidCount = bills.filter((bill) => bill.paid === false).length;

        return {
            total: bills.length,
            paid: paidCount,
            unpaid: unpaidCount
        };

    } catch (error) {
        console.error('Error fetching bills stats:', error);
        return {
            total: 0,
            paid: 0,
            unpaid: 0
        };
    }
}

export default getBillsStats;
