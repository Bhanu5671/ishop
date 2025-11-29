"use client"
import React, { useRef } from 'react'
import Link from 'next/link'
import { FaBackward } from "react-icons/fa"
import { axiosApiInstance, getCookie, titletoSlug } from '@/app/library/helper'
import { toast } from 'react-toastify'

export default function AddColors() {
    const token = getCookie("admin_token")
    const nameRef = useRef()
    const slugRef = useRef()
    const colorRef = useRef()

    const nameChangeHandler = () => {
        slugRef.current.value = titletoSlug(nameRef.current.value)
    }

    const colorSubmitHandler = (e) => {
        e.preventDefault()
        const data = {
            name: nameRef.current.value,
            slug: slugRef.current.value,
            hexacode: colorRef.current.value,
        }

        axiosApiInstance
            .post("/color/create", data, {
                headers: { Authorization: token ?? "" },
            })
            .then((response) => {
                if (response.data.flag === 1) {
                    e.target.reset()
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            })
            .catch((err) => {
                console.error("Error creating color:", err)
            })
    }

    return (
        <>
            <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <section className="w-full max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
                    <header className="mb-6">
                        <h1 className="text-3xl font-semibold text-black tracking-wide">Add Colors</h1>
                        <p className="text-gray-600 mt-1 text-lg">Add a new color to organize your inventory</p>
                    </header>

                    <div className="flex justify-end mb-6">
                        <Link href="/admin/color" passHref>
                            <button
                                type="button"
                                className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
                            >
                                <FaBackward className="h-5 w-5" />
                                <span>Back to Colors</span>
                            </button>
                        </Link>
                    </div>

                    <form onSubmit={colorSubmitHandler} className="space-y-8 max-w-full">
                        <div className="flex flex-col">
                            <label htmlFor="color-name" className="text-lg font-semibold text-black mb-3">
                                Color Name
                            </label>
                            <input
                                id="color-name"
                                type="text"
                                placeholder="Enter Color name"
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={nameRef}
                                onChange={nameChangeHandler}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="color-slug" className="text-lg font-semibold text-black mb-3">
                                Color Slug
                            </label>
                            <input
                                id="color-slug"
                                type="text"
                                placeholder="Color slug"
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={slugRef}
                            />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="color-picker" className="text-lg font-semibold text-black mb-3">
                                Select Color
                            </label>
                            <input
                                id="color-picker"
                                type="color"
                                ref={colorRef}
                                className="cursor-pointer w-12 h-12 rounded-md border border-[#e2e2e2] shadow-sm"
                                defaultValue="#000000"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-md bg-black px-8 py-4 text-white text-lg font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    )
}
