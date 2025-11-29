export default function PaymentStatus({ recentOrder }) {
    // Helper: try to infer paid status from an order object
    const isOrderPaid = (o) => {
        if (o == null) return false
        // boolean
        if (typeof o === "boolean") return o === true
        // numeric (1 treated as paid)
        if (typeof o === "number") return o === 1
        // string representations
        if (typeof o === "string") {
            return ["paid", "true", "1"].includes(o.toLowerCase())
        }
        // object with common fields (support camelCase and snake_case; treat Razorpay payment id as paid)
        if (typeof o === "object") {
            if ("isPaid" in o) return !!o.isPaid
            if ("paid" in o) {
                if (typeof o.paid === "number") return o.paid === 1
                return o.paid === true || (typeof o.paid === "string" && ["paid", "true", "1"].includes(o.paid.toLowerCase()))
            }
            if ("paymentStatus" in o) return String(o.paymentStatus).toLowerCase() === "paid" || String(o.paymentStatus) === "1"
            if ("payment_status" in o) {
                const v = o.payment_status
                if (typeof v === "number") return v === 1
                return String(v).toLowerCase() === "paid" || String(v) === "1" || String(v).toLowerCase() === "true"
            }
            if ("status" in o) return String(o.status).toLowerCase() === "paid" || String(o.status) === "1"
            if ("order_status" in o) {
                const v = o.order_status
                if (typeof v === "number") return v === 1
                return String(v).toLowerCase() === "paid" || String(v) === "1" || String(v).toLowerCase() === "true"
            }
            if ("payment" in o) return String(o.payment).toLowerCase() === "paid"
            // treat presence of a payment provider id as paid (e.g. Razorpay)
            if ("razorpay_payment_id" in o && o.razorpay_payment_id) return true
            if ("razorpay_paymentid" in o && o.razorpay_paymentid) return true
            if ("razorpay_order_id" in o && o.razorpay_order_id) return true
        }
        return false
    }

    // Derive counts from recentOrder prop
    let paidCount = 0
    let unpaidCount = 0

    if (Array.isArray(recentOrder)) {
        const totalOrders = recentOrder.length
        paidCount = recentOrder.filter(isOrderPaid).length
        unpaidCount = totalOrders - paidCount
    } else if (recentOrder && typeof recentOrder === "object") {
        // Accept shape: { paid, unpaid } or { paidCount, unpaidCount } or { total, paid }
        if ("paidCount" in recentOrder || "unpaidCount" in recentOrder) {
            paidCount = Number(recentOrder.paidCount || 0)
            unpaidCount = Number(recentOrder.unpaidCount || 0)
        } else if ("paid" in recentOrder || "unpaid" in recentOrder) {
            paidCount = Number(recentOrder.paid || 0)
            unpaidCount = Number(recentOrder.unpaid || 0)
        } else if ("total" in recentOrder && "paid" in recentOrder) {
            paidCount = Number(recentOrder.paid || 0)
            unpaidCount = Math.max(0, Number(recentOrder.total || 0) - paidCount)
        } else {
            // Fallback: treat the object as a single order document (your provided shape: payment_status: 1 etc.)
            paidCount = isOrderPaid(recentOrder) ? 1 : 0
            unpaidCount = paidCount ? 0 : 1
        }
    } else if (typeof recentOrder === "number") {
        // If a single number provided, treat as total with unknown paid (fallback to 0 paid)
        paidCount = 0
        unpaidCount = Math.max(0, recentOrder)
    } else {
        // No recentOrder provided: keep previous demo values
        paidCount = 892
        unpaidCount = 342
    }

    // Ensure non-negative integers
    paidCount = Math.max(0, Math.floor(paidCount))
    unpaidCount = Math.max(0, Math.floor(unpaidCount))

    const total = paidCount + unpaidCount || 0

    const computePercentage = (value) => (total > 0 ? Math.round((value / total) * 100) : 0)

    const paymentData = [
        { name: "Paid", value: paidCount, percentage: computePercentage(paidCount), color: "#10b981" },
        { name: "Unpaid", value: unpaidCount, percentage: computePercentage(unpaidCount), color: "#f59e0b" },
    ]

    // SVG pie generation (same logic as before)
    let currentAngle = 0
    const segments = paymentData.map((item) => {
        const sliceAngle = total === 0 ? 0 : (item.value / total) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + sliceAngle
        currentAngle = endAngle

        const startRad = (startAngle * Math.PI) / 180
        const endRad = (endAngle * Math.PI) / 180

        const x1 = 50 + 40 * Math.cos(startRad)
        const y1 = 50 + 40 * Math.sin(startRad)
        const x2 = 50 + 40 * Math.cos(endRad)
        const y2 = 50 + 40 * Math.sin(endRad)

        const largeArc = sliceAngle > 180 ? 1 : 0
        const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`, "Z"].join(" ")

        return (
            <path
                key={item.name}
                d={pathData}
                fill={item.color}
                className="hover:opacity-80 transition-opacity"
            />
        )
    })

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-black mb-6">Payment Status</h2>
            <div className="flex flex-col items-center mb-6">
                <svg width="180" height="180" viewBox="0 0 100 100">
                    {segments}
                    <circle cx="50" cy="50" r="25" fill="white" />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-sm font-bold fill-black">
                        {total}
                    </text>
                </svg>
            </div>
            <div className="space-y-3">
                {paymentData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-black text-sm">{item.value}</p>
                            <p className="text-xs text-gray-600">{item.percentage}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
