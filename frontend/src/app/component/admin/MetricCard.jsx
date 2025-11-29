export default function MetricCard({ title, value, icon: Icon, beforeValue = "" }) {
    return (
        <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-black/5">
                    <Icon size={20} className="text-black" />
                </div>
            </div>
            <p className="text-gray-600 text-xs font-medium mb-1">{title}</p>
            <p className="text-lg md:text-xl font-bold text-black">{beforeValue}{value}</p>
        </div>
    )
}
