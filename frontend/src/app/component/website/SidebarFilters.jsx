import Link from "next/link"
import { getCategoryData } from "@/app/library/api-call"
import ColorBox from "./ColorBox"
import RangeSelect from "./RangeSelect"
import { FiFilter, FiX } from "react-icons/fi"

const brands = ["Apple", "Beats", "Belkin", "Logitech", "Bose"]

export default async function SidebarFilters() {
    const categoryJSON = await getCategoryData(null, true)
    const categories = categoryJSON ? categoryJSON.categories : []

    const filtersMarkup = (
        <div className="space-y-6">
            <div className="rounded-md border bg-white border-[#e5e5e5]">
                <div className="border-b px-4 py-3 font-medium border-[#e5e5e5] uppercase text-black">Categories</div>
                <ul className="px-4 py-2 text-sm">
                    {categories.map((category) => (
                        <li key={category._id} className="flex items-center justify-between py-2 text-[#737373]">
                            <Link
                                href={`/store/${category.slug}`}
                                className={category.active ? "text-blue-700 font-medium" : "text-[#737373] hover:text-black"}
                            >
                                {category.name}
                            </Link>
                            <span className="text-xs text-[#9a9a9a]">({category.ProductCount})</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-md border bg-white border-[#e5e5e5]">
                <div className="border-b px-4 py-3 font-medium border-[#e5e5e5] uppercase text-black">Prices</div>
                <div className="px-4 py-4 text-[#737373]">
                    <div className="mb-2 text-xs text-[#9a9a9a]">Range:</div>
                    <RangeSelect />
                </div>
            </div>

            <div className="rounded-md border bg-white border-[#e5e5e5]">
                <div className="border-b px-4 py-3 font-medium border-[#e5e5e5] uppercase text-black">Color</div>
                <div className="px-4 py-3">
                    <ColorBox />
                </div>
            </div>

            <div className="rounded-md border bg-white border-[#e5e5e5]">
                <div className="border-b px-4 py-3 font-medium border-[#e5e5e5] uppercase text-black">Brand</div>
                <div className="px-4 py-3 space-y-2 text-[#737373]">
                    {brands.map((b) => (
                        <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" />
                            <span className="text-[#737373]">{b}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <>
            <div className="md:hidden">
                <details className="group relative">
                    <summary
                        className="sticky top-0 z-10 flex items-center gap-2 w-full rounded-md border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-black shadow-sm cursor-pointer list-none"
                        aria-controls="mobile-filters"
                    >
                        <FiFilter className="h-4 w-4 group-open:hidden" aria-hidden="true" />
                        <FiX className="hidden h-4 w-4 group-open:block" aria-hidden="true" />
                        <span className="group-open:hidden">Filter</span>
                        <span className="hidden group-open:inline">Close</span>
                        <span className="sr-only">Toggle filter menu</span>
                    </summary>

                    {/* Animated overlay with fade, blocks background on open */}
                    <div
                        className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-300 group-open:pointer-events-auto group-open:opacity-100 bg-black/40"
                        aria-hidden="true"
                    />

                    {/* Slide-over drawer with smooth transition and better mobile sizing */}
                    <div
                        id="mobile-filters"
                        role="dialog"
                        aria-label="Filters"
                        className="fixed inset-y-0 right-0 z-50 w-80 max-w-[90%] translate-x-full overflow-y-auto bg-white p-4 shadow-xl transition-transform duration-300 will-change-transform group-open:translate-x-0"
                    >
                        <h3 className="mb-3 text-sm font-semibold uppercase text-black">Filters</h3>
                        {filtersMarkup}
                    </div>
                </details>
            </div>
            <aside className="hidden md:block">{filtersMarkup}</aside>
        </>
    )
}
