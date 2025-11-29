"use client"
import React, { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { axiosApiInstance } from '@/app/library/helper'
import { toast } from 'react-toastify'

export default function AdminLoginPage() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const router = useRouter()

    const submitHandler = (e) => {
        e.preventDefault()
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        axiosApiInstance.post("/login/checklogin", data, {
            withCredentials: true
        }).then((response) => {
            if (response.data.flag === 1) {
                localStorage.setItem("admin", JSON.stringify(response.data.AdminExist))
                localStorage.setItem("loginAt", new Date())
                toast.success(response.data.message)
                router.push("/admin")
            } else {
                toast.error(response.data.message)
            }
        }).catch((error) => {
            toast.error(error.toString())
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 relative px-4">
            {/* Sign Up Prompt */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-gray-600 text-sm">Not registered yet?</span>
                <Link href="/admin-auth/signup">
                    <button className="bg-gray-800 text-white px-4 py-1 rounded-lg hover:bg-black transition cursor-pointer">
                        Sign up
                    </button>
                </Link>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    {/* Optional: Add a logo or icon here */}
                    <span className="text-5xl text-gray-700 select-none">🔒</span>
                </div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Login</h2>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            ref={emailRef}
                            placeholder="admin@example.com"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            ref={passwordRef}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-black transition cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
