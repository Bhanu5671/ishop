"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { clearCart, saveCartToLocalStorage } from "@/redux/features/cartSlice"
import { removeUser, saveUserToLocalStorage } from "@/redux/features/userSlice"
import { clearWishlist } from "@/redux/features/wishlistSlice"

// Icons (react-icons only)
import { FiShoppingCart, FiUser, FiSearch, FiPackage, FiChevronRight } from "react-icons/fi"
import { CgProfile } from "react-icons/cg"
import { MdLogout } from "react-icons/md"
import { FaRegHeart, FaBoxOpen } from "react-icons/fa"
import { RxCross2 } from "react-icons/rx"
import { IoIosSearch } from "react-icons/io"
import { HiOutlineMenu } from "react-icons/hi"

const nav = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/iphone", label: "iPhone" },
    { href: "/ipad", label: "iPad" },
    { href: "/macbook", label: "MacBook" },
    // { href: "/store/accessories", label: "Accessories" },
]

export default function Header() {
    const cart = useSelector((store) => store.cart)
    const user = useSelector((store) => store.user)

    const dispatch = useDispatch()
    const router = useRouter()

    const [searchToggle, setSearchToggle] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showOrders, setShowOrders] = useState(false)

    useEffect(() => {
        dispatch(saveCartToLocalStorage())
        dispatch(saveUserToLocalStorage())
    }, [dispatch])

    const loginHandler = () => {
        if (user?.data == null) {
            router.push("/login?ref=header")
        } else {
            router.push("/profile")
        }
    }

    const handleProfileClick = () => {
        if (user?.data == null) {
            loginHandler()
        } else {
            setShowMenu((prev) => !prev)
        }
    }

    const handleLogout = () => {
        dispatch(removeUser())
        dispatch(clearCart())
        dispatch(clearWishlist())
        setShowMenu(false)
        router.push("/")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const data = { search: e.target.search.value }
        console.log("Search Data", data)
        setSearchToggle(false)
        router.push(`/search?search=${data.search}`)
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm">
            <div className="mx-auto w-full max-w-7xl px-4">
                {/* Top Bar */}
                <div className="flex h-16 items-center justify-between">
                    {/* LEFT: Logo + Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Open menu"
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <HiOutlineMenu className="h-5 w-5" />
                        </button>

                        <Link href="/" aria-label="iSHOP home" className="inline-flex items-center">
                            <span className="text-xl font-bold tracking-tight text-[#FF4252]">iSHOP</span>
                        </Link>
                    </div>

                    {/* CENTER: Primary Nav (desktop) */}
                    <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:text-[#2E90E5]"
                            >
                                {item.label.toUpperCase()}
                            </Link>
                        ))}
                    </nav>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <button
                            aria-label="Search"
                            onClick={() => setSearchToggle(true)}
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        >
                            <FiSearch className="h-5 w-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            aria-label="Wishlist"
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <FaRegHeart className="h-5 w-5" />
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            aria-label="Cart"
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <FiShoppingCart className="h-5 w-5" />
                            {cart?.items?.length > 0 && (
                                <span
                                    aria-label={`${cart.items.length} items in cart`}
                                    className="absolute -right-1 -top-1 inline-flex min-w-3 min-h-3 items-center justify-center rounded-full bg-primary p-1.5 text-[10px] font-medium leading-none text-primary-foreground bg-black text-white"
                                >
                                    {cart.items.length}
                                </span>
                            )}
                        </Link>

                        {/* Profile */}
                        <div
                            className="relative"
                            onMouseEnter={() => user?.data && setShowMenu(true)}
                            onMouseLeave={() => user?.data && setShowMenu(false)}
                        >
                            <button
                                onClick={handleProfileClick}
                                aria-label="Profile"
                                className="inline-flex h-9 items-center gap-2 rounded-md px-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                            >
                                <FiUser className="h-5 w-5" />
                                <span className="hidden sm:inline text-sm text-muted-foreground">
                                    {user?.data ? `Hi, ${user.data.name}` : "Login"}
                                </span>
                            </button>

                            {/* Profile Menu */}
                            {user?.data && showMenu && (
                                <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-[#e2e2e2] bg-white shadow-lg">
                                    <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                        onClick={() => {
                                            setShowMenu(false)
                                            router.push("/profile")
                                        }}
                                    >
                                        <CgProfile className="h-4 w-4" />
                                        Profile
                                    </button>
                                    <Link href="/orders"
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                    >
                                        <FiPackage className="h-4 w-4" />
                                        Orders
                                    </Link>
                                    <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        <MdLogout className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Nav (mobile) */}
                <div className="md:hidden">{/* Reserved spacing for potential breadcrumbs or promos */}</div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60]">
                    <div
                        aria-hidden="true"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-foreground/20 backdrop-blur-xs"
                    />
                    <aside className="absolute left-0 top-0 h-screen w-80 max-w-[80%] flex flex-col bg-white border border-white/20 shadow-lg">
                        <div className="flex items-center justify-between p-4">
                            <Link href="/" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-[#FF4252]">
                                iSHOP
                            </Link>
                            <button
                                aria-label="Close menu"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <RxCross2 className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-1 p-2" aria-label="Mobile Primary">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto p-4">
                            <div className="grid grid-cols-3 gap-2">
                                <Link
                                    href="/cart"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <FiShoppingCart />
                                    Cart
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <FaRegHeart />
                                    Wish
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileOpen(false)
                                        setSearchToggle(true)
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <FiSearch />
                                    Search
                                </button>
                                {/* Orders */}
                                <Link
                                    href="/orders"
                                    className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <FiPackage />
                                    Orders
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Search Overlay */}
            {searchToggle && (
                <div className="fixed inset-0 z-[70]">
                    <div
                        className="absolute inset-0 bg-white/70 backdrop-blur-xs"
                        onClick={() => setSearchToggle(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute left-1/2 top-[20%] w-11/12 -translate-x-1/2 rounded-lg border border-[#e2e2e2] bg-white/90 backdrop-blur-md p-3 shadow-lg md:w-1/2">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-medium text-muted-foreground">Search products</h2>
                            <button
                                aria-label="Close search"
                                onClick={() => setSearchToggle(false)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <RxCross2 className="h-4 w-4 cursor-pointer" />
                            </button>
                        </div>
                        <form onSubmit={handleSearch} className="flex items-center gap-3">
                            <IoIosSearch className="h-6 w-6 text-muted-foreground" />
                            <input
                                type="search"
                                name="search"
                                placeholder="Search for iPhone, iPad, Macbook, accessories..."
                                className="w-full rounded-md border border-[#e2e2e2] bg-background px-3 py-2 text-sm outline-none"
                            />
                            <button
                                type="submit"
                                className="inline-flex shrink-0 items-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    )
}
