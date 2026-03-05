import { Admin } from "@/app/types"
import { getCookie } from "@/lib/server-cookies";
import WarningToast from "@/components/WarningToast"
import { Card } from "@/components/ui/card"

type ResultData = {
    success: boolean,
    message: string,
    data: Admin
}

type DashboardResult = {
    success: boolean
    message: string
    data: Admin | null
}

async function getAdminProfile(): Promise<DashboardResult> {
    try {
        const token = await getCookie('accessToken');

        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`
        
        // Fetch dengan timeout
        const fetchWithTimeout = (timeout: number = 8000) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            return fetch(url, {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
        };

        const response = await fetchWithTimeout()

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.error(responseData?.message)
            return {
                success: false,
                message: responseData?.message || "Gagal memuat data admin",
                data: null
            }
        }
        
        return {
            success: true,
            message: "",
            data: responseData.data
        }

    } catch (error: any) {
        console.error(error)
        if (error?.name === 'AbortError') {
            return {
                success: false,
                message: "Koneksi timeout. Server tidak merespon dalam waktu yang ditentukan",
                data: null
            }
        }
        return {
            success: false,
            message: "Gagal memuat data admin",
            data: null
        }
    }
}

export default async function DashboardAdmin() {
    const result = await getAdminProfile()
    const adminData = result.data
    
    if (!result.success || adminData == null) {
        return  (
            <div className="container mx-auto py-10 px-4">
                <WarningToast success={result.success} message={result.message} />
                <Card className="p-8 text-center">
                    <p className="text-lg font-medium text-red-600">⚠️ Gagal Memuat Data</p>
                    <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
                </Card>
            </div>
        )
    }
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="w-full p-5 bg-sky-50 rounded">
                <h1 className="font-bold text-sky-500 text-xl">Admin Profile</h1>
                <table>
                    <tbody className="text-black">
                        <tr>
                            <td className="p-2">Name</td>
                            <td className="p-2">: {adminData.name}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Username</td>
                            <td className="p-2">: {adminData.user.username}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Phone</td>
                            <td className="p-2">: {adminData.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}