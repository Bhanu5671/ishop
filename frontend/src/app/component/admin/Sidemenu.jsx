"use client"
import { useState } from "react"
import { MdOutlineDashboard, MdKeyboardArrowUp, MdOutlineKeyboardArrowDown, MdOutlineStore } from "react-icons/md"
import { FaRegUser } from "react-icons/fa"
import { FiPackage } from "react-icons/fi"
import { TbReport } from "react-icons/tb"
import Link from "next/link"

export default function Sidemenu() {
    const [isAssetsOpen, setIsAssetsOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-[#e2e2e2] rounded-md hover:bg-gray-100 transition"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                type="button"
            >
                {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div
                // stop clicks inside the sidebar from reaching the overlay
                onClick={(e) => e.stopPropagation()}
                className={`shadow-lg bg-white p-6 min-h-screen w-full md:max-w-xs border-r border-[#e2e2e2] flex flex-col transition-transform duration-300 ${isMobileMenuOpen
                    ? "fixed left-0 top-0 z-40 translate-x-0"
                    : "fixed left-0 top-0 z-40 -translate-x-full md:translate-x-0 md:static"
                    }`}
            >
                <h3 className="text-center text-2xl font-extrabold mb-8 text-black">Admin Panel</h3>
                <nav className="flex flex-col gap-4 text-lg font-medium text-black">
                    {/* Dashboard */}
                    <button
                        className="flex justify-between items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                        type="button"
                        aria-controls="dashboard-menu"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <Link href={"/admin"} className="flex items-center gap-2">
                            <MdOutlineDashboard className="text-black" size={22} />
                            <span>Dashboard</span>
                        </Link>
                    </button>
                    {/* Assets */}
                    <button
                        onClick={() => {
                            setIsAssetsOpen(!isAssetsOpen);
                            if (isUserOpen == true) {
                                setIsUserOpen(false)
                            }
                        }}
                        className="flex justify-between items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                        type="button"
                        aria-expanded={isAssetsOpen}
                        aria-controls="assets-menu"
                    >
                        <div className="flex items-center gap-2">
                            <MdOutlineStore className="text-black" size={22} />
                            <span>Assets</span>
                        </div>
                        {isAssetsOpen ? <MdKeyboardArrowUp size={24} /> : <MdOutlineKeyboardArrowDown size={24} />}
                    </button>
                    {isAssetsOpen && (
                        <div id="assets-menu" className="flex flex-col gap-2 pl-8 text-gray-500">
                            <Link href="/admin/category" className="hover:text-black transition" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAssetsOpen(!isAssetsOpen)
                            }}>
                                Category
                            </Link>
                            <Link href="/admin/color" className="hover:text-black transition" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAssetsOpen(!isAssetsOpen)
                            }}>
                                Color
                            </Link>
                            <Link href="/admin/product" className="hover:text-black transition" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsAssetsOpen(!isAssetsOpen)
                            }}>
                                Product
                            </Link>
                        </div>
                    )}

                    {/* Users */}
                    <button
                        onClick={() => {
                            setIsUserOpen(!isUserOpen);
                            if (isAssetsOpen == true) {
                                setIsAssetsOpen(false)
                            }
                        }}
                        className="flex justify-between items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                        type="button"
                        aria-expanded={isUserOpen}
                        aria-controls="users-menu"
                    >
                        <div className="flex items-center gap-2">
                            <FaRegUser className="text-black" size={20} />
                            <span>Users</span>
                        </div>
                        {isUserOpen ? <MdKeyboardArrowUp size={24} /> : <MdOutlineKeyboardArrowDown size={24} />}
                    </button>
                    {isUserOpen && (
                        <div id="users-menu" className="flex flex-col gap-2 pl-8 text-gray-500">
                            <Link href="/admin/users/admin" className="hover:text-black transition" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsUserOpen(!isUserOpen)
                            }}>
                                Admin
                            </Link>
                            <Link href="/admin/users/website" className="hover:text-black transition" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsUserOpen(!isUserOpen)
                            }}>
                                Website
                            </Link>
                        </div>
                    )}

                    {/* Reports */}
                    <Link
                        href="/admin/reports"
                        className="px-3 py-2 rounded-md hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer text-black"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <TbReport size={22} />
                        <span>Reports</span>
                    </Link>

                    {/* Orders */}
                    <Link
                        href="/admin/orders"
                        className="px-3 py-2 rounded-md hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer text-black"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FiPackage size={22} />
                        <span>Orders</span>
                    </Link>
                </nav>
            </div>
        </>
    )
}
