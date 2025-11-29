import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"

export default function Promo() {
    return (
        <div className="relative overflow-hidden rounded-xl border border-[#e2e2e2] bg-card shadow-md flex flex-col md:flex-row items-center">
            <div className="p-8 flex-1">
                <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold mb-3">
                    Limited Time Offer
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Save up to 40% on select accessories</h3>
                <p className="text-muted-foreground mb-4">
                    Upgrade your setup with premium gear. Discounts auto-applied at checkout.
                </p>
                <Link
                    href="#bestsellers"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:opacity-90 transition"
                    aria-label="Shop deals in bestsellers"
                >
                    Shop Deals
                    <FiArrowRight className="h-5 w-5" aria-hidden />
                </Link>
            </div>
            <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/website-main-image/tech accessories flatlay.jpg`}
                alt="Tech accessories"
                className="h-48 md:h-64 w-full md:w-1/2 object-cover"
                loading="lazy"
            />
        </div>
    )
}
