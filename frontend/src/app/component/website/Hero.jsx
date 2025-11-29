import Link from "next/link"
import { FiArrowRight } from "react-icons/fi"

export default function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 bg-black text-[var(--hero-fg)] overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/website-main-image/Apple-iPhone-17-Pro-Max-2-1.webp`}
                alt="iPhone 17 Pro Max product photography on black background"
                className="absolute inset-0 h-full w-full object-contain"
            />
            <div className="absolute inset-0" />
            <div className="relative z-10 max-w-3xl">
                <h1 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tight text-white">iPhone 17 Pro Max</h1>
                <p className="text-pretty mt-4 md:mt-6 text-base md:text-xl text-white/80">
                    Titanium build. A19 Pro. ProMotion 120Hz. Capture the future in stunning detail.
                </p>
                <div className="mt-8">
                    <Link
                        href="/iphone"
                        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold shadow hover:opacity-90 transition"
                        aria-label="Shop now in the store"
                    >
                        <span>Shop Now</span>
                        <FiArrowRight className="h-5 w-5" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    )
}
