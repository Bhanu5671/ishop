"use client"
import React, { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { axiosApiInstance } from '@/app/library/helper'
import { toast } from 'react-toastify'

export default function AdminSignupPage() {
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault()
    const data = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    axiosApiInstance.post("/login/createaccount", data)
      .then(response => {
        if (response.data.flag === 1) {
          toast.success(response.data.message)
          router.push("/admin-auth/login")
        } else {
          toast.error(response.data.message)
        }
      })
      .catch(error => {
        toast.error(error.toString())
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* Login Prompt */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-gray-600 text-sm">Already have an account?</span>
        <Link href="/admin-auth/login">
          <button className="bg-gray-800 text-white px-4 py-1 rounded-lg hover:bg-black transition cursor-pointer">
            Login
          </button>
        </Link>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6 select-none">
          <span className="text-5xl text-gray-700">👤</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Sign Up</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              ref={emailRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              ref={passwordRef}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-black transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
