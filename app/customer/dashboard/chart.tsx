"use client"

import { Bills } from "@/app/types"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"


export function BillsChart({ data }: { data: Bills[] }) {
    const chartData = data.map((bill) => ({
        month: new Date(bill.year, bill.month - 1).toLocaleString("id-ID", { month: "short" }),
        amount: bill.amount,
        usage: bill.usage_value,
    }))

const last = chartData[0]?.amount || 0
const prev = chartData[1]?.amount || 0

const trend = 
    last > prev
        ? "Tagihan meningkat dari bulan sebelumnya"
        : last < prev
        ? "Tagihan menurun dari bulan sebelumnya"
        : "Tagihan stabil dibanding bulan sebelumnya"

const getStatus = (bills: any) => {
    if (bills.payments == null) return "unpaid"
    if (!bills.payment?.verified) return "pending"
    return "paid"
}

const total = data 
    .filter((b) => getStatus(b) === "unpaid")
    .reduce((a, b) => a + b.amount,0)

const unpaid = data.filter((b) => getStatus(b) === "unpaid").length
const pending = data.filter((b) => getStatus(b) === "pending").length
const paid = data.filter((b) => getStatus(b) === "paid").length

    return (
        <div className="space-y-6">
            {/* Trend Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-blue-900 font-semibold text-lg">{trend}</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Tagihan</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">
                    Rp {total.toLocaleString("id-ID")}
                </div>
                <p className="text-gray-600 text-sm">Total Tagihan Belum Dibayar</p>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
                {/* Unpaid */}
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <div className="text-2xl font-bold text-red-600">{unpaid}</div>
                    <p className="text-gray-600 text-sm mt-1">Belum Dibayar</p>
                </div>

                {/* Pending */}
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="text-2xl font-bold text-yellow-600">{pending}</div>
                    <p className="text-gray-600 text-sm mt-1">Dalam Proses</p>
                </div>

                {/* Paid */}
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="text-2xl font-bold text-green-600">{paid}</div>
                    <p className="text-gray-600 text-sm mt-1">Sudah Dibayar</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Grafik Tagihan & Penggunaan</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => `Rp ${value?.toLocaleString?.("id-ID") || value}`}
                            contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            dot={{ fill: "#ef4444", r: 5 }}
                            name="Tagihan"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="usage" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", r: 5 }}
                            name="Penggunaan (m³)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}