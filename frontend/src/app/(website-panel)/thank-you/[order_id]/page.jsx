"use client"
import { axiosApiInstance } from "@/app/library/helper"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiMapPin, FiCreditCard, FiStar } from "react-icons/fi"
import { useSelector } from "react-redux"

export default function ThankYouPage({ params }) {
  const { order_id } = React.use(params)
  const [orderDetails, setOrderDetails] = useState({})
  const user = useSelector((store) => store.user)

  const fetchData = () => {
    axiosApiInstance
      .get(`/order/get-order/${order_id}`)
      .then((response) => {
        if (response.data.flag == 1) {
          setOrderDetails(response.data.order_details)
        } else {
          console.log(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-100/40 rounded-full blur-2xl"></div>
      </div>

      <main className="relative max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-lg animate-bounce">
            <FiCheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-3 text-balance">Order Placed Successfully!</h1>
          <p className="text-lg text-green-700 mb-2">Thank you for choosing us</p>
          <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Order #{order_id}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200 shadow-xl mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <FiPackage className="h-5 w-5 mr-2 text-green-600" />
              Your Items
            </h2>

            <div className="space-y-3 mb-4">
              {orderDetails?.product_details?.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-3 bg-green-50/50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${item.main_image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-green-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-800">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">₹{orderDetails.order_total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FiMapPin className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-green-800">Delivery Address</h3>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{orderDetails.shipping_address?.name}</p>
              <p className="text-xs leading-relaxed">
                {orderDetails.shipping_address?.street}, {orderDetails.shipping_address?.city}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FiCreditCard className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-green-800">Payment</h3>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-xs">Pay when delivered</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-green-800 mb-4">What's Next?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiPackage className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm">Processing</h4>
                <p className="text-xs text-gray-600">Preparing your order</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiTruck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm">Delivery</h4>
                <p className="text-xs text-gray-600">Track your package</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <FiPackage className="h-4 w-4 mr-2" />
            Track Order
          </button>
          <Link
            href="/store"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-medium rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg border border-green-200"
          >
            <FiHome className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="text-center bg-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-center mb-2">
            <FiStar className="h-5 w-5 text-yellow-300" />
          </div>
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-green-100 mb-3">Our support team is ready to assist you</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a href="/support" className="text-sm text-green-100 hover:text-white transition-colors underline">
              Contact Support
            </a>
            <span className="hidden sm:inline text-green-300">•</span>
            <a href="/faq" className="text-sm text-green-100 hover:text-white transition-colors underline">
              View FAQ
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
