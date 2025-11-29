"use client"

import { axiosApiInstance } from "@/app/library/helper"
import { useEffect, useState } from "react"
import { FiUser, FiSearch, FiClock } from "react-icons/fi"

export default function WebsiteUsersPage() {
    const [users, setUsers] = useState([])

    const fetchData = () => {
        axiosApiInstance.get("/user/getallusers").then(
            (response) => {
                if (response.data.flag == 1) {
                    setUsers(response.data.allUsers)
                } else {
                    console.log(response.data.message)
                }
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )
    }


    useEffect(
        () => {
            fetchData()
        }, []
    )


    return (
        <main className="px-4 py-8 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-pretty text-2xl font-semibold text-black md:text-3xl">Website Users</h1>
                        <p className="text-sm text-neutral-600">
                            Users currently registered on the website. View recent logins and account details.
                        </p>
                    </div>

                </header>

                {/* Table (desktop) */}
                <section
                    aria-labelledby="website-users-heading"
                    className="overflow-hidden rounded-xl border border-[#e2e2e2] bg-white shadow-sm"
                >
                    <h2 id="website-users-heading" className="sr-only">
                        Website Users list
                    </h2>

                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-700">
                                    <tr className="[&>th]:px-4 [&>th]:py-3">
                                        <th>Profile</th>
                                        <th>User ID</th>
                                        <th>Email</th>
                                        <th>Created</th>
                                        <th>Last Login</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e2e2e2]">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-neutral-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e2e2] bg-white shadow-sm">
                                                        <FiUser className="text-black" />
                                                    </span>
                                                    <div>
                                                        <div className="font-medium text-black">{user.name}</div>
                                                        <div className="text-xs text-neutral-600">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-neutral-800">{user._id}</td>
                                            <td className="px-4 py-3">{user.email}</td>
                                            <td className="px-4 py-3">{user.createdAt?.split("T")[0]} {user.createdAt?.split("T")[1].split(".")[0]}</td>
                                            <td className="px-4 py-3">
                                                <div className="inline-flex items-center gap-1 text-neutral-800">
                                                    <FiClock aria-hidden />
                                                    <span>{user.loginAt?.split("T")[0]} {user.loginAt?.split("T")[1].split(".")[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full border border-[#e2e2e2] px-2.5 py-1 text-xs font-medium shadow-sm ${user.status === "active" ? "bg-white text-black" : "bg-neutral-100 text-neutral-700"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cards (mobile) */}
                    <div className="grid gap-3 p-3 md:hidden">
                        {users.map((user) => (
                            <article
                                key={user._id}
                                className="rounded-xl border border-[#e2e2e2] bg-white p-4 shadow-sm hover:shadow-md"
                                aria-label={`${user.name} user summary`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e2e2] bg-white shadow-sm">
                                            <FiUser className="text-black" />
                                        </span>
                                        <div>
                                            <h3 className="font-medium text-black">{user.name}</h3>
                                            <p className="text-xs text-neutral-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full border border-[#e2e2e2] bg-white px-2.5 py-1 text-xs text-black shadow-sm">
                                        {user.status}
                                    </span>
                                </div>

                                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-700">
                                    <div>
                                        <dt className="text-neutral-500">User ID</dt>
                                        <dd className="font-mono">{user._id}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-neutral-500">Created</dt>
                                        <dd>{user.createdAt?.split("T")[0]} {user.createdAt?.split("T")[1].split(".")[0]}</dd>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-1">
                                        <FiClock className="text-neutral-600" aria-hidden />
                                        <span>Last login: {user.loginAt?.split("T")[0]} {user.loginAt?.split("T")[1].split(".")[0]}</span>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
