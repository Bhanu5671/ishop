export default function RecentOrders({ recentOrder }) {
    const recentOrders = recentOrder

    const getStatusColor = (status) => {
        switch (status) {
            case 3:
                return "bg-green-100 text-green-700"
            case 1:
                return "bg-yellow-100 text-yellow-700"
            case 4:
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-black mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Order ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders?.map((order) => (
                            <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-black text-sm">{order._id}</td>
                                <td className="py-4 px-4 text-gray-700 text-sm">{order.user_id.name}</td>
                                <td className="py-4 px-4 font-semibold text-black text-sm">Rs.{order.order_total}</td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}
                                    >
                                        {order.order_status == 1 ? "Pending" : "" ||
                                            order.order_status == 3 ? "Complete" : "" ||
                                                order.order_status == 4 ? "Cancel" : ""}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-gray-600 text-sm">{order.createdAt.split("T")[0].replaceAll("-", "/")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
