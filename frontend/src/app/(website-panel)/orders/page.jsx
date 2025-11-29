// 'use client' is required because this page uses React state and interactions.
"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { FiSearch, FiFilter, FiDownload, FiChevronRight } from "react-icons/fi"
import { FaBoxOpen } from "react-icons/fa"

// Sample data for demonstration. Replace with your data fetching later.

import { useSelector } from "react-redux"
import { axiosApiInstance } from "@/app/library/helper"

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"]

export default function OrdersPage() {

    const user = useSelector((state) => state.user);
    const [orderDetails, setOrderDetails] = useState(null);

    const fetchData = () => {
        if (user.data != null) {
            axiosApiInstance.get(`/order/get-all-orders/${user?.data?._id}`, {
                headers: {
                    Authorization: user?.token
                }
            }).then(
                (response) => {
                    if (response.data.flag == 1) {
                        setOrderDetails(response.data.orders)
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
    };

    useEffect(() => {
        fetchData()
    }, []);


    console.log("Get Orders", orderDetails)


    const [query, setQuery] = useState("")
    const [activeStatus, setActiveStatus] = useState("All")


    // const filtered = useMemo(() => {
    //     const q = query.trim().toLowerCase()
    //     return orders.filter((o) => {
    //         const matchesQuery =
    //             !q ||
    //             o.id?.toLowerCase().includes(q) ||
    //             o.status?.toLowerCase().includes(q) ||
    //             (o.items || []).some((it) => (it?.name || it?.title || "").toLowerCase().includes(q))
    //         const matchesStatus = activeStatus === "All" || o.status?.toLowerCase() === activeStatus.toLowerCase()
    //         return matchesQuery && matchesStatus
    //     })
    // }, [orders, query, activeStatus])

    // Minimal status styles (black primary, green for delivered, red for cancelled)
    const statusStyles = {
        Pending: "border border-border bg-card text-foreground",
        Processing: "border border-border bg-card text-foreground",
        Shipped: "border border-border bg-card text-foreground",
        Delivered: "border-transparent bg-green-600/10 text-green-700",
        Cancelled: "border-transparent bg-red-600/10 text-red-700",
        ReturnedRequest: "border-transparent bg-orange-600/10 text-orange-700",
        Returned: "border-transparent bg-purple-600/10 text-purple-700",
    }

    return (
        <main className="min-h-auto bg-background">
            <header className="border-b border-[#e2e2e2] bg-card">
                <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Orders</h1>
                            <p className="text-sm text-[#737373]">
                                Track your purchases, download invoices, and view order details.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
                            {/* Search */}
                            <label className="relative block w-full sm:w-72">
                                <span className="sr-only">Search orders</span>
                                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by ID, status, or item"
                                    className="w-full rounded-md border border-[#e2e2e2] bg-card px-9 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </label>

                            {/* Export */}
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <FiDownload className="h-4 w-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        {STATUSES.map((s) => {
                            const active = activeStatus === s
                            return (
                                <button
                                    key={s}
                                    onClick={() => setActiveStatus(s)}
                                    className={[
                                        "inline-flex items-center rounded-full border px-3 py-1 text-xs shadow-sm transition",
                                        active
                                            ? "border-transparent bg-foreground text-background"
                                            : "border-[#e2e2e2] bg-card text-foreground hover:border-foreground/30",
                                    ].join(" ")}
                                >
                                    {s}
                                </button>
                            )
                        })}
                        <span className="ml-auto inline-flex items-center gap-2 text-xs text-[#737373]">
                            <FiFilter className="h-4 w-4" />
                            {orderDetails?.length} result{orderDetails?.length === 1 ? "" : "s"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Orders List */}
            <section className="mx-auto w-full max-w-6xl px-4 py-8">
                {orderDetails?.length === 0 ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
                        <div className="rounded-full border border-border p-4 shadow-sm">
                            <FaBoxOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">No orders found</p>
                            <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search query.</p>
                        </div>
                        <Link
                            href="/store"
                            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm text-background shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            Browse Store
                        </Link>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 gap-4 md:gap-5">
                        {orderDetails?.map((order) => (
                            <li key={order._id}>
                                <article className="rounded-lg border border-[#e2e2e2] bg-card p-4 shadow-sm transition hover:shadow-md">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-semibold text-foreground">Order {order._id}</h3>
                                            <span
                                                className={[
                                                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs",
                                                    statusStyles[order?.order_status] || "border border-[#e2e2e2] bg-card text-foreground",
                                                ].join(" ")}
                                            >
                                                {order?.order_status == 1 && "Processing"
                                                    || order?.order_status == 2 && "Shipped"
                                                    || order?.order_status == 3 && "Delivered"
                                                    || order?.order_status == 4 && "Cancelled"
                                                    || order?.order_status == 0 && "Pending"
                                                    || order?.order_status == 5 && "Returned Request"
                                                    || order?.order_status == 6 && "Returned"
                                                }
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="text-muted-foreground text-[#737373]">
                                                Placed on{" "}
                                                <span className="text-[#0a0a0a]">{order?.createdAt?.split("T")[0].replaceAll("-", "/")}</span>
                                            </div>
                                            <div className="font-semibold text-foreground">Rs.{order?.order_total?.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    {/* Items list with image, name, price */}
                                    <div className="mt-4 flex flex-col gap-3">
                                        {order?.product_details?.map((product) => {
                                            return (
                                                <div
                                                    key={product?._id}
                                                    className="flex flex-col sm:flex-row items-center gap-3 rounded-md border border-[#e2e2e2] bg-background/50 p-3 shadow-sm"
                                                >
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product?.main_image}`}
                                                        alt={product?.name || "Product image"}
                                                        className="h-16 w-16 sm:h-12 sm:w-12 rounded-md border border-[#e2e2e2] p-2 object-contain"
                                                    />
                                                    <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                                                        <div className="min-w-0 text-center sm:text-left px-2">
                                                            <p className="truncate text-sm font-medium text-foreground">
                                                                {product?.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">x{product?.qty || 1}</p>
                                                        </div>
                                                        <div className="shrink-0 text-sm font-semibold text-foreground">
                                                            Rs.{product?.total}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center justify-end">
                                        <Link
                                            href={""}
                                            className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-xs text-background shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            View details
                                            <FiChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}
