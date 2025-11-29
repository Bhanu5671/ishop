"use client"

import { useEffect, useState } from "react"
import DashboardHeader from "@/app/component/admin/DashboardHeader"
import MetricsGrid from "@/app/component/admin/MatricsGrid"
import RecentOrders from "@/app/component/admin/RecentOrder"
import PaymentStatus from "@/app/component/admin/PaymentStatus"
import { axiosApiInstance, getCookie } from "@/app/library/helper"


export default function Dashboard() {

  const token = getCookie("admin_token")

  const [timeRange, setTimeRange] = useState("week");
  const [recentOrder, setRecentOrder] = useState();
  const [productCount, setProductCount] = useState(0)


  const fetchData = () => {
    axiosApiInstance.get("/order/recent-order", {
      headers: {
        Authorization: token ?? ""
      }
    }).then(
      (response) => {
        if (response.data.flag == 1) {
          setRecentOrder(response.data.recentOrders)
          console.log(response.data.recentOrders)
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


  const countProduct = () => {
    axiosApiInstance.get("/product/product-count").then(
      (response) => {
        if (response.data.flag == 1) {
          setProductCount(response.data.productCount)
          console.log(response.data.productCount)
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


  useEffect(() => {
    fetchData();
    countProduct();
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <MetricsGrid recentOrder={recentOrder} productCount={productCount} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RecentOrders recentOrder={recentOrder} />
          </div>
          <div>
            <PaymentStatus recentOrder={recentOrder} />
          </div>
        </div>
      </main>
    </div>
  )
}
