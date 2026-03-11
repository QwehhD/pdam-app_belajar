"use client"

import { useState } from "react"
import { storeCookie } from "@/lib/client-cookies"

export default function SignIpPage() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault()
        try {
            const request = JSON.stringify({
                username,
                password,
            });
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`           
                },
                body: request,
            });

            if (!response.ok) {
                alert("gagal");
                return;
            }
              const responseData = await response.json();
            storeCookie("accessToken",responseData.token)
          
            if (responseData.role == "ADMIN") {
                window.location.href = "/admin/dashboard"
            } else if (responseData.role == "CUSTOMER") {
                window.location.href = "/customer/dashboard"
            }

            

            
        } catch (error) {
            console.log("Error during sign up: ", error);
        }
    }


    return (
        <div className="w-full h-dvh bg-gray-900 dark:bg-black p-3 flex items-center justify-center">
            <div className="bg-gray-800 dark:bg-gray-900 p-10 w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-lg">
                <h1 className="text-center font-bold text-white text-2xl">
                    Sign-In
                </h1>

                <form className="my-3" onSubmit={handleSignUp}>
                    <label htmlFor="username" className="text-sm font-semibold text-gray-300">Username</label>
                    <input type="text" id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-white mb-2 rounded" />

                    <label htmlFor="password" className="text-sm font-semibold text-gray-300">Password</label>
                    <input type="password" id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-white mb-2 rounded" />

                    <button type="submit"
                        className="w-full bg-sky-600 text-white p-2 font-semibold hover:bg-sky-700 rounded">
                        Sign-In
                    </button>

                </form>
            </div>
        </div>
    )

}