"use client"

export default function DashboardHeader({ timeRange, setTimeRange }) {
    return (
        <header className="bg-white border-b border-gray-100 shadow-sm">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-black">Dashboard</h1>
                        <p className="text-gray-600 mt-1 text-sm">Welcome back! Here's your business overview.</p>
                    </div>
                    <div className="flex gap-2">
                        {["day", "week", "month"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${timeRange === range ? "bg-black text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}
