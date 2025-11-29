import { FiTruck, FiHeadphones, FiRotateCcw } from "react-icons/fi"

const items = [
    {
        title: "Free Shipping",
        desc: "On all orders over $99 with fast, reliable delivery.",
        Icon: FiTruck,
    },
    {
        title: "24x7 Support",
        desc: "Our team is here around the clock to help you.",
        Icon: FiHeadphones,
    },
    {
        title: "100% Return",
        desc: "Hassle-free returns within 30 days of purchase.",
        Icon: FiRotateCcw,
    },
]

export default function Features() {
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-balance">Why Shop With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map(({ title, desc, Icon }) => (
                    <div
                        key={title}
                        className="rounded-xl border border-[#e2e2e2] cursor-pointer bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                                <Icon className="h-6 w-6" aria-hidden />
                            </div>
                            <h3 className="text-lg font-semibold">{title}</h3>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
