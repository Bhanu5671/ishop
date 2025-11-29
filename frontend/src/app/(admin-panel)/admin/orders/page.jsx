"use client"

import { axiosApiInstance, getCookie } from "@/app/library/helper"
import { useEffect, useState } from "react"
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiMoreVertical,
  FiTruck,
  FiCreditCard,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiClock,
  FiPackage,
} from "react-icons/fi"

function StatusBadge({ status }) {
  const map = {
    0: {
      label: "Pending",
      icon: <FiClock className="w-4 h-4 text-amber-600" aria-hidden="true" />,
      className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100 animate-pulse",
    },
    1: {
      label: "Shipped",
      icon: <FiTruck className="w-4 h-4 text-blue-600" aria-hidden="true" />,
      className: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    },
    2: {
      label: "Out for Delivery",
      icon: <FiTruck className="w-4 h-4 text-sky-600" aria-hidden="true" />,
      className: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    },
    3: {
      label: "Delivered",
      icon: <FiCheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />,
      className: "bg-green-50 text-green-700 ring-1 ring-green-100",
    },
    4: {
      label: "Cancelled",
      icon: <FiXCircle className="w-4 h-4 text-red-600" aria-hidden="true" />,
      className: "bg-red-50 text-red-700 ring-1 ring-red-100",
    },
    5: {
      label: "Refund Requested",
      icon: <FiPackage className="w-4 h-4 text-indigo-600" aria-hidden="true" />,
      className: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    },
    6: {
      label: "Refunded",
      icon: <FiCheckCircle className="w-4 h-4 text-sky-600" aria-hidden="true" />,
      className: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    },
  }

  const key = Number(status)
  const cfg = map[key] || map[1]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}>
      {cfg.icon}
      <span className="sr-only">Status:</span>
      {cfg.label}
    </span>
  )
}

function ActionButton({ children, onClick, variant = "primary", title }) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
  const variants = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "bg-white text-black border border-gray-200 hover:bg-gray-50",
  }
  return (
    <button type="button" title={title} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}

export default function OrdersPage() {
  const token = getCookie("admin_token")
  const [orderData, setOrderData] = useState([])

  const fetchData = () => {
    axiosApiInstance
      .get("/order/getallorders", {
        headers: {
          Authorization: token ?? "",
        },
      })
      .then((response) => {
        if (response.data.flag === 1) {
          setOrderData(response.data.allUserOrders)
          console.log(response.data.allUserOrders)
        } else {
          console.error("Error fetching orders:", response.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const totalOrder = () => {
    let totalOrders = 0;
    for (let i = 0; i < orderData.length; i++) {
      totalOrders += orderData[i].product_details.length;
    }
    return totalOrders;
  }


  const totalPaid = () => {
    let totalPaid = 0;
    for (let i = 0; i < orderData.length; i++) {
      if (orderData[i].payment_status == 1) totalPaid++;
    }
    return totalPaid;
  }


  const pendingPayment = () => {
    let pendingPayment = 0;
    for (let i = 0; i < orderData.length; i++) {
      if (orderData[i].payment_status == 0) pendingPayment++;
    }
    return pendingPayment;
  }


  const deliveredOrders = () => {
    let deliveredOrders = 0;
    for (let i = 0; i < orderData.length; i++) {
      if (orderData[i].order_status == 4) deliveredOrders++;
    }
    return deliveredOrders;
  }


  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    totalOrder();
    totalPaid();
    pendingPayment();
    deliveredOrders()
  }, [orderData])



  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Orders</h1>
            <p className="mt-1 text-sm text-gray-600">Manage customer orders, payments, and fulfillment status.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton variant="outline" title="Export CSV">
              <FiDownload className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </ActionButton>
            <ActionButton title="Bulk Actions">
              <FiMoreVertical className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Actions</span>
            </ActionButton>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-600">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalOrder()}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FiCreditCard className="w-4 h-4" aria-hidden="true" />Payment Paid
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">{totalPaid()}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FiRefreshCw className="w-4 h-4" aria-hidden="true" />Payment Pending
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingPayment()}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FiTruck className="w-4 h-4" aria-hidden="true" /> Delivered
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{deliveredOrders()}</p>
        </div>
      </section>

      {/* Search and Filter Controls */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by order ID, customer, product..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <FiFilter
              className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <select
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
              aria-label="Filter by status"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Shipped</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Desktop Table View */}
      <section className="hidden lg:block rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-gray-700">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Order Status</th>
                <th className="px-4 py-3 font-semibold">Order Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orderData.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 truncate">{order._id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{order.user_id.name}</span>
                      <span className="text-xs text-gray-500">{order.user_id.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-3">
                      {order?.product_details.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product.main_image}`}
                            alt={product.name}
                            className="w-10 h-10 rounded-md border border-gray-200 object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0 max-w-50">
                            <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                <FiPackage className="w-3 h-3" aria-hidden="true" />
                                Qty: {product.qty}
                              </span>
                              <span className="text-xs font-semibold text-gray-700">₹{product.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₹{order?.order_total}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FiCreditCard className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{order?.payment_method === 1 ? "Razorpay" : "COD"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order?.order_status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-[2px] text-gray-700">
                        <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gray-100">
                          <FiClock className="w-3 h-3 text-gray-600" aria-hidden="true" />
                        </span>
                        <span className="text-[13px] font-medium">{order?.createdAt.split("T")[0].replaceAll("-", "/")}</span>
                      </div>
                      <span className="text-xs text-gray-500 pl-7">{order?.createdAt.split("T")[1].split(".")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ActionButton variant="outline" title="View order">
                      View
                    </ActionButton>
                  </td>
                </tr>
              ))}
              {orderData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile Card View */}
      <section className="lg:hidden space-y-4">
        {orderData.map((order) => (
          <div
            key={order._id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</p>
                <p className="mt-1 font-semibold text-gray-900 truncate">{order._id}</p>
              </div>
              <StatusBadge status={order?.order_status} />
            </div>

            {/* Card Body */}
            <div className="px-4 py-4 space-y-4">
              {/* Customer Info */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</p>
                <p className="mt-1 font-medium text-gray-900">{order.user_id.name}</p>
                <p className="text-sm text-gray-600">{order.user_id.email}</p>
              </div>

              {/* Products */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Products</p>
                <div className="space-y-2.5">
                  {order?.product_details.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product.main_image}`}
                        alt={product.name}
                        className="w-14 h-14 rounded-md border border-gray-200 object-cover flex-shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <FiPackage className="w-3 h-3" aria-hidden="true" />
                            Qty: {product.qty}
                          </span>
                          <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">₹{order?.order_total}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
                    <FiCreditCard className="w-4 h-4" aria-hidden="true" />
                    <span>{order?.payment_method === 1 ? "Razorpay" : "COD"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Date</p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-700">
                    <FiClock className="w-4 h-4 text-gray-500" aria-hidden="true" />
                    <span className="font-medium">{order?.createdAt.split("T")[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Time</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {order?.createdAt.split("T")[1].split(".")[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex gap-2">
              <ActionButton variant="outline" title="View order" className="flex-1">
                <FiChevronRight className="w-4 h-4" aria-hidden="true" />
                <span>View</span>
              </ActionButton>
            </div>
          </div>
        ))}

        {orderData.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </section>
    </main>
  )
}
