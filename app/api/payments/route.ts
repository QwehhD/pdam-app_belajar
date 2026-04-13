import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const appKey = process.env.NEXT_PUBLIC_APP_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

        if (!appKey || !baseUrl) {
            return NextResponse.json(
                { success: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        const incomingFormData = await request.formData();
        const billId = incomingFormData.get("bill_id");
        const paymentProof =
            incomingFormData.get("payment_proof") ?? incomingFormData.get("file");

        if (typeof billId !== "string" || billId.trim().length === 0) {
            return NextResponse.json(
                { success: false, message: "bill_id is required" },
                { status: 400 }
            );
        }

        if (!(paymentProof instanceof File)) {
            return NextResponse.json(
                { success: false, message: "payment proof file is required" },
                { status: 400 }
            );
        }

        const formData = new FormData();
        formData.append("bill_id", billId);
        formData.append("file", paymentProof);

        for (const [key, value] of incomingFormData.entries()) {
            if (key === "bill_id" || key === "file" || key === "payment_proof") {
                continue;
            }
            formData.append(key, value);
        }

        const response = await fetch(`${baseUrl}/payments`, {
            method: "POST",
            headers: {
                "APP-KEY": appKey,
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        const rawResult = await response.text();
        let result: Record<string, unknown>;
        try {
            result = rawResult
                ? (JSON.parse(rawResult) as Record<string, unknown>)
                : { success: response.ok, message: response.ok ? "Success" : "Request failed" };
        } catch {
            result = {
                success: false,
                message: rawResult || "Upstream service returned an invalid response",
            };
        }

        return NextResponse.json(result, { status: response.status });

    } catch (error: unknown) {
        console.error("API Proxy Error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
