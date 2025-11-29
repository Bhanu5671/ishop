"use client"
import { useRef } from "react"
import Link from "next/link"
import { getCookie, titletoSlug } from "@/app/library/helper"
import { toast } from "react-toastify"
import { FaBackward } from "react-icons/fa"
import { axiosApiInstance } from "@/app/library/helper"

export default function Add() {
    const token = getCookie("admin_token")

    const nameRef = useRef()
    const slugRef = useRef()

    const nameChangeHandler = () => {
        slugRef.current.value = titletoSlug(nameRef.current.value)
    }
    const submitHandler = (e) => {
        e.preventDefault()

        const data = {
            name: nameRef.current.value,
            slug: slugRef.current.value,
        }

        axiosApiInstance
            .post("/category/create", data, {
                headers: {
                    Authorization: token ?? "",
                },
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
                console.error("Error creating category:", err)
            })
    }
    return (
        <>
            <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <section className="w-full bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8 max-w-full mx-auto">
                    {/* Header */}
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-black tracking-wide">
                                Add Category
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm md:text-base">
                                Add a new product category to organize your inventory
                            </p>
                        </div>

                        {/* Actions */}
                        <div>
                            <Link href="/admin/category" passHref>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                                >
                                    <FaBackward className="h-5 w-5" />
                                    <span>Back to Category</span>
                                </button>
                            </Link>
                        </div>
                    </header>

                    {/* Card/Form */}
                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Category Name */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="category-name"
                                className="text-lg font-semibold text-black mb-3"
                            >
                                Category Name
                            </label>
                            <input
                                id="category-name"
                                type="text"
                                placeholder="Enter category name"
                                className="w-full rounded-md border border-[#e2e2e2] bg-white px-5 py-4 text-black placeholder-gray-400 outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={nameRef}
                                onChange={nameChangeHandler}
                            />
                        </div>

                        {/* Category Slug */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="category-slug"
                                className="text-lg font-semibold text-black mb-3"
                            >
                                Category Slug
                            </label>
                            <input
                                id="category-slug"
                                type="text"
                                placeholder="Category slug"
                                className="w-full rounded-md border border-[#e2e2e2] bg-gray-100 px-5 py-4 text-black placeholder-gray-400 cursor-not-allowed outline-none shadow-sm focus:shadow-md focus:border-black transition"
                                required
                                ref={slugRef}
                                readOnly={true}
                            />
                        </div>

                        {/* Submit */}
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
