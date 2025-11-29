import MetricCard from "@/app/component/admin/MetricCard"

import { TrendingUp, Package, CreditCard, AlertCircle } from "lucide-react"

export default function MetricsGrid({ recentOrder, productCount }) {

    const totalRevenue = recentOrder?.reduce((acc, order) => acc + order.order_total, 0)

    const totalOrder = () => {
        let totalOrders = 0;
        for (let i = 0; i < recentOrder?.length; i++) {
            totalOrders += recentOrder[i].product_details.length;
        }
        return totalOrders;
    }

    const paymentPaid = () => {
        let paymentPaid = 0;
        recentOrder?.map(
            (order) => {
                if (order.payment_method == 1) {
                    paymentPaid += order.order_total;
                }
            }
        )
        return paymentPaid;
    }


    const paymentUnPaid = () => {
        let paymentUnPaid = 0;
        recentOrder?.map(
            (order) => {
                if (order.payment_method == 0) {
                    paymentUnPaid += order.order_total;
                }
            }
        )
        return paymentUnPaid;
    }

    const metrics = [
        {
            title: "Total Revenue",
            value: totalRevenue,
            beforeValue: "Rs.",
            icon: TrendingUp,
        },
        {
            title: "Total Orders",
            value: totalOrder(),
            icon: Package,
        },
        {
            title: "Paid Payments",
            value: paymentPaid(),
            beforeValue: "Rs.",
            icon: CreditCard,
        },
        {
            title: "Unpaid Payments",
            value: paymentUnPaid(),
            beforeValue: "Rs.",
            icon: AlertCircle,
        },
        {
            title: "Products Added",
            value: productCount,
            icon: Package,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric}/>
            ))}
        </div>
    )
}
