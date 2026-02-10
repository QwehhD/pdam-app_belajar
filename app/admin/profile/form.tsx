"use client";

import { Admin } from "@/app/types";
import { useState } from "react";

type Props = {
    admin: Admin;
}

export default function AdminProfileForm({ admin }: Props) {
    const [isEdit, setIsEdit] = useState(false);

    const [profile, setProfile] = useState({
        name: admin.name,
        username: admin.user.username,
        phone: admin.phone,
    });

    return (
        <div className="w-full h-full bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Admin Profile
                    </h1>

                    {!isEdit ? (
                        <button
                            onClick={() => setIsEdit(true)}
                            className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setProfile({
                                        name: admin.name,
                                        username: admin.user.username,
                                        phone: admin.phone,
                                    });
                                    setIsEdit(false);
                                }}
                                className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    console.log("submit", profile);
                                    setIsEdit(false);
                                }}
                                className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Input Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            disabled={!isEdit}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-gray-50"
                        />
                    </div>

                    {/* Input Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={profile.username}
                            disabled={!isEdit}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-gray-50"
                        />
                    </div>

                    {/* Input Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            value={profile.phone}
                            disabled={!isEdit}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="mt-1 block w-full border rounded-md p-2 disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}