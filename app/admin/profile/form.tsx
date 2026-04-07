"use client";

import { Admin } from "@/app/types";
import { getCookie } from "@/lib/client-cookies";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { User, Phone, AtSign, ShieldCheck, Calendar, Save, X, Edit3, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    admin?: Admin;
}

export default function AdminProfileForm({ admin }: Props) {
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        name: admin?.name || "",
        username: admin?.user?.username || "",
        phone: admin?.phone || "",
    });

    if (!admin) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-xl">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="rounded-full bg-red-50 dark:bg-red-900/20 w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Data admin tidak ditemukan</h2>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = await getCookie("accessToken");
            if (!token) {
                toast.error("Token tidak ditemukan. Silakan login kembali");
                setLoading(false);
                return;
            }

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${admin.id}`;
            const payload = JSON.stringify({
                name: profile.name,
                username: profile.username,
                phone: profile.phone,
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                body: payload,
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message || "Gagal mengupdate profil");
                setLoading(false);
                return;
            }

            toast.success("Profil berhasil diupdate!");
            setIsEdit(false);
            setLoading(false);
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            toast.error("Gagal mengupdate profil");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Header Section - Edge to Edge */}
            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/dashboard" 
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Pengaturan Profil
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">
                                Akun Personal
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!isEdit ? (
                            <button
                                onClick={() => setIsEdit(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profil
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setProfile({
                                            name: admin.name,
                                            username: admin.user.username,
                                            phone: admin.phone,
                                        });
                                        setIsEdit(false);
                                    }}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Full Width */}
            <div className="w-full px-6 py-8 lg:px-12">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* Form Card */}
                    <Card className="xl:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 p-8">
                            <CardTitle className="dark:text-white">Informasi Dasar</CardTitle>
                            <CardDescription className="dark:text-slate-400">Pastikan data yang Anda masukkan sudah benar dan terbaru.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <User className="w-4 h-4 text-blue-500" />
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        disabled={!isEdit}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Contoh: Ahmad Subardjo"
                                    />
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <AtSign className="w-4 h-4 text-purple-500" />
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        disabled={!isEdit}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Contoh: ahmad_admin"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <Phone className="w-4 h-4 text-emerald-500" />
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        disabled={!isEdit}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex flex-col items-center py-4 border-b border-slate-100 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-blue-200 dark:shadow-none">
                                        {profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{admin.name}</h3>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full mt-2">
                                        Administrator
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">ID Sistem</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{admin.id}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">Terdaftar</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(admin.updatedAt).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-500 font-medium">
                                <strong>Catatan:</strong> Perubahan pada profil akan langsung terlihat di dashboard setelah Anda menekan tombol simpan. Pastikan nomor telepon aktif untuk keperluan notifikasi sistem.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}