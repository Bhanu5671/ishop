"use client"

import { axiosApiInstance, getCookie } from "@/app/library/helper"
import { useEffect, useState } from "react"
import { FiShield, FiSearch, FiEye, FiEyeOff, FiLock, FiUnlock, FiTrash2 } from "react-icons/fi"

export default function AdminUsersPage() {
    const token = getCookie("admin_token")
    const [users, setUsers] = useState(null)

    const fetchUsers = () => {
        axiosApiInstance
            .get("/login/getalluser")
            .then((response) => {
                if (response.data.flag == 1) {
                    setUsers(response.data.allUser)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    function toggleBlock(id, block) {
        const data = {
            id: id,
            block: !block
        }
        axiosApiInstance.patch("/login/toggleblock", data, {
            headers: {
                Authorization: token ?? "",
            },
        })
            .then((response) => {
                if (response.data.flag == 1) {
                    setUsers(response.data.allUser)
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    function removeUser(id) {
        axiosApiInstance.delete(`/login/deleteuser/${id}`, {
            headers: {
                Authorization: token ?? "",
            },
        })
            .then((response) => {
                if (response.data.flag == 1) {
                    setUsers(response.data.allUser)
                }
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Users</h1>
                        <p className="text-sm text-slate-600 mt-1">Manage administrators, permissions, and access status.</p>
                    </div>
                </header>

                {/* Data Container */}
                <section
                    aria-labelledby="admin-users-heading"
                    className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                >
                    <h2 id="admin-users-heading" className="sr-only">
                        Admin Users list
                    </h2>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Admin</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">User ID</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Email</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Role</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap w-54">Create Account</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap w-48">Last Active</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Status</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {users?.length === 0 && (
                                        <tr>
                                            <td colSpan="9" className="p-8 text-center text-slate-500 text-base">
                                                No admin users found.
                                            </td>
                                        </tr>
                                    )}
                                    {users?.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                                                        <FiShield className="text-slate-700" size={18} />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-slate-900 truncate">
                                                            {user.first_name} {user.last_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-700 text-xs truncate">{user._id}</td>
                                            <td className="px-4 py-3 text-slate-700 truncate">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    Admin
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 w-48 text-slate-700 text-sm">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">{user.createdAt?.split("T")[0]}</span>
                                                    <span className="text-xs text-slate-500">{user.createdAt?.split("T")[1]?.split(".")[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 w-48 text-slate-700 text-sm">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">{user?.lastActive?.split("T")[0]}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {user?.lastActive?.split("T")[1]?.split(".")[0]}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${user.block ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}
                                                >
                                                    {user.block ? "Blocked" : "Active"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleBlock(user._id, user.block)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                                        aria-label={user.block ? "Unblock user" : "Block user"}
                                                    >
                                                        {user.block ? (
                                                            <>
                                                                <FiUnlock size={14} /> Unblock
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiLock size={14} /> Block
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => removeUser(user._id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 active:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                                                        aria-label="Remove user"
                                                    >
                                                        <FiTrash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tablet View - Horizontal Scrollable Cards */}
                    <div className="hidden md:block lg:hidden">
                        <div className="overflow-x-auto">
                            <div className="flex gap-4 p-4 min-w-min">
                                {users?.length === 0 && (
                                    <div className="w-full p-8 text-center text-slate-500">No admin users found.</div>
                                )}
                                {users?.map((user) => (
                                    <article
                                        key={user._id}
                                        className="flex-shrink-0 w-96 rounded-lg border border-slate-200 bg-white p-4 shadow-md hover:shadow-lg transition"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                                                    <FiShield className="text-slate-700" size={20} />
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-slate-900 truncate">
                                                        {user.first_name} {user.last_name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`flex-shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${user.block ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}
                                            >
                                                {user.block ? "Blocked" : "Active"}
                                            </span>
                                        </div>
                                        <dl className="space-y-3 text-xs text-slate-700 mb-4">
                                            <div>
                                                <dt className="text-slate-500 font-medium">User ID</dt>
                                                <dd className="font-mono text-slate-900 break-all mt-0.5">{user._id}</dd>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Created</dt>
                                                    <dd className="text-slate-900 mt-0.5">
                                                        <div className="text-xs">{user.createdAt?.split("T")[0]}</div>
                                                        <div className="text-xs text-slate-500">{user.createdAt?.split("T")[1]?.split(".")[0]}</div>
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-slate-500 font-medium">Last Active</dt>
                                                    <dd className="text-slate-900 mt-0.5">
                                                        <div className="text-xs">{user?.lastActive?.split("T")[0]}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {user?.lastActive?.split("T")[1]?.split(".")[0]}
                                                        </div>
                                                    </dd>
                                                </div>
                                            </div>
                                        </dl>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleBlock(user._id, user.block)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                                aria-label={user.block ? "Unblock user" : "Block user"}
                                            >
                                                {user.block ? (
                                                    <>
                                                        <FiUnlock size={14} /> Unblock
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiLock size={14} /> Block
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => removeUser(user._id)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 active:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                                                aria-label="Remove user"
                                            >
                                                <FiTrash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        <div className="divide-y divide-slate-200">
                            {users?.length === 0 && <div className="p-6 text-center text-slate-500">No admin users found.</div>}
                            {users?.map((user) => (
                                <article key={user._id} className="p-4 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                                                <FiShield className="text-slate-700" size={20} />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-slate-900 truncate">
                                                    {user.first_name} {user.last_name}
                                                </h3>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`flex-shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${user.block ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}
                                        >
                                            {user.block ? "Blocked" : "Active"}
                                        </span>
                                    </div>
                                    <dl className="space-y-2 text-xs text-slate-700">
                                        <div>
                                            <dt className="text-slate-500 font-medium">User ID</dt>
                                            <dd className="font-mono text-slate-900 break-all mt-0.5">{user._id}</dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div>
                                                <dt className="text-slate-500 font-medium">Created</dt>
                                                <dd className="text-slate-900 mt-0.5">
                                                    <div className="text-xs font-medium">{user.createdAt?.split("T")[0]}</div>
                                                    <div className="text-xs text-slate-500">{user.createdAt?.split("T")[1]?.split(".")[0]}</div>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 font-medium">Last Active</dt>
                                                <dd className="text-slate-900 mt-0.5">
                                                    <div className="text-xs font-medium">{user?.lastActive?.split("T")[0]}</div>
                                                    <div className="text-xs text-slate-500">{user?.lastActive?.split("T")[1]?.split(".")[0]}</div>
                                                </dd>
                                            </div>
                                        </div>
                                    </dl>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => toggleBlock(user._id, user.block)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                            aria-label={user.block ? "Unblock user" : "Block user"}
                                        >
                                            {user.block ? (
                                                <>
                                                    <FiUnlock size={14} /> Unblock
                                                </>
                                            ) : (
                                                <>
                                                    <FiLock size={14} /> Block
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => removeUser(user._id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 active:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                                            aria-label="Remove user"
                                        >
                                            <FiTrash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
