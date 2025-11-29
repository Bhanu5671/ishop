"use client"
import { axiosApiInstance } from "@/app/library/helper"
import { useEffect, useState } from "react"
import { FiMinus, FiPlus, FiHome, FiShoppingCart } from "react-icons/fi"
import { useSelector } from "react-redux"
import { saveCartToLocalStorage } from "@/redux/features/cartSlice"
import { useDispatch } from "react-redux"
import { updateQuantity } from "@/redux/features/cartSlice"
import { useRouter } from "next/navigation"
import DeleteToggle from "@/app/component/website/DeleteToggle"
import Link from "next/link"

export default function CartPage() {
    const cartItems = useSelector((store) => store.cart.items)
    const cartFinalPrice = useSelector((store) => store.cart.final_price)
    const cartOriginalPrice = useSelector((store) => store.cart.original_price)
    const user = useSelector((store) => store.user)
    const [productInCart, setProductInCart] = useState([])
    const dispatch = useDispatch()
    const router = useRouter()

    console.log("Product In Cart Length", productInCart?.length)
    console.log("User ", user)

    const ids = cartItems.map((item) => item.productId).join("-")

    const fetchData = () => {
        if (cartItems.length === 0) return
        axiosApiInstance
            .get(`/product/get-data-by-ids/${ids}`)
            .then((response) => {
                console.log(response.data)
                setProductInCart(response.data.products)
            })
            .catch((error) => {
                console.error("Error fetching product data:", error)
            })
    }

    const checkoutHandler = () => {
        if (user?.data == null) {
            router.push("/login?ref=checkout")
        } else {
            router.push("/checkout")
        }
    }

    useEffect(() => {
        dispatch(saveCartToLocalStorage())
    }, [])

    useEffect(() => {
        if (cartItems.length === 0) {
            setProductInCart([]) // Clear product list when cart is empty
            return
        }
        fetchData()
    }, [cartItems])

    const getItemCount = (pId) => {
        const item = cartItems.find((item) => item.productId === pId)
        console.log("getitem function", item)
        return item ? item.quantity : 0
    }

    const [voucherCode, setVoucherCode] = useState("")

    const updateQuantityForCart = (productId, flag, final_price, original_price, new_qty = 0, userId = null) => {
        dispatch(updateQuantity({ productId, flag, final_price, original_price }))
        if (user?.data != null) {
            axiosApiInstance
                .patch("/cart/change-quantity", { userId, productId, new_qty })
                .then((response) => {
                    if (response.data.flag == 1) {
                        console.log(response.data.message)
                    } else {
                        console.log(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    // const deleteItem = (id, final_price, original_price, user_id) => {
    //   console.log("user id in de;ete otem", user_id)
    //   dispatch(removeItem({ id, final_price, original_price }));
    //   if (user?.data != null) {
    //     console.log("Called Delete")
    //     axiosApiInstance.delete(`/cart/remove/${id}`, { data: { userId: user.data._id } }).then(
    //       (response) => {
    //         if (response.data.flag == 1) {
    //           console.log(response.data.message)
    //         } else {
    //           console.log(response.data.message)
    //         }
    //       }
    //     ).catch(
    //       (error) => {
    //         console.log(error)
    //       }
    //     )
    //   }
    // }

    const shippingFee = 20
    const total = cartFinalPrice + shippingFee

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <FiShoppingCart size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <h1 className="text-balance text-2xl font-semibold text-gray-900">Your Cart</h1>
                                <p className="text-sm text-gray-500">
                                    {productInCart?.length || 0} {productInCart?.length === 1 ? "item" : "items"} in your bag
                                </p>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                            <Link href={"/"}><FiHome className="text-gray-400" aria-hidden="true" /></Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-gray-700">Cart</span>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Items */}
                    <section className="lg:col-span-8">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            {/* Table header (desktop) */}
                            <div className="sticky top-0 z-10 hidden grid-cols-12 gap-4 border-b border-gray-200 bg-white/80 px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500 md:grid">
                                <div className="col-span-4">Product</div>
                                <div className="col-span-2 text-center">Unit</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-right">Total</div>
                                <div className="col-span-2 text-right">Action</div>
                            </div>

                            {/* Items list */}
                            {productInCart.length > 0 ? (
                                productInCart.map((item) => {
                                    const countQuantity = getItemCount(item._id)
                                    console.log("Deleted Count Quantity ", countQuantity)
                                    return (
                                        <article
                                            key={item._id}
                                            className="group grid grid-cols-1 gap-4 border-b border-gray-100 px-4 py-5 last:border-none md:grid-cols-12 md:items-center md:px-6"
                                        >
                                            {/* Product */}
                                            <div className="md:col-span-4 flex items-start gap-4">
                                                <div className="relative shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${item.main_image}`}
                                                        alt={item.name}
                                                        className="h-20 w-20 object-contain"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center gap-10 md:block">


                                                    <div className="min-w-0">
                                                        <h3 className="text-pretty text-sm font-medium text-gray-900">{item.name}</h3>
                                                        <div className="mt-1 flex items-center gap-2 text-xs">
                                                            <span className="rounded bg-green-50 px-2 py-0.5 font-medium text-green-700">
                                                                Save Rs.{Math.max(item.original_price - item.final_price, 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Mobile delete */}
                                                    <div className="md:hidden">
                                                        <DeleteToggle
                                                            id={item._id}
                                                            final_price={item.final_price}
                                                            original_price={item.original_price}
                                                            user_id={user?.data?._id}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Unit price */}
                                            <div className="md:col-span-2 flex items-center justify-between md:block max-md:hidden">
                                                <div className="md:text-center">
                                                    <del className="block text-xs text-gray-400">Rs.{item.original_price}</del>
                                                    <span className="block text-sm font-semibold text-gray-900">Rs.{item.final_price}</span>
                                                </div>
                                                {/* Mobile delete */}
                                                {/* <div className="mt-3 md:hidden">
                                                    <DeleteToggle
                                                        id={item._id}
                                                        final_price={item.final_price}
                                                        original_price={item.original_price}
                                                        user_id={user?.data?._id}
                                                    />
                                                </div> */}
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-2 flex items-center justify-start md:justify-center">
                                                <div className="flex justify-between items-center gap-20 md:block">
                                                    <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantityForCart(
                                                                    item._id,
                                                                    0,
                                                                    item.final_price,
                                                                    item.original_price,
                                                                    countQuantity - 1,
                                                                    user.data._id,
                                                                )
                                                            }
                                                            className="h-10 w-10 md:h-9 md:w-9 inline-flex items-center justify-center rounded-l-lg hover:bg-gray-50 focus:outline-none cursor-pointer"
                                                            aria-label="Decrease quantity"
                                                            title="Decrease"
                                                        >
                                                            {countQuantity == 1 ? (
                                                                <FiMinus size={16} className="text-gray-400 cursor-not-allowed pointer-events-none" />
                                                            ) : (
                                                                <FiMinus size={16} className="text-gray-700" />
                                                            )}
                                                        </button>
                                                        <span className="min-w-12 text-center text-sm font-medium text-gray-900">
                                                            {countQuantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantityForCart(
                                                                    item._id,
                                                                    1,
                                                                    item.final_price,
                                                                    item.original_price,
                                                                    countQuantity + 1,
                                                                    user.data._id,
                                                                )
                                                            }
                                                            className="h-10 w-10 md:h-9 md:w-9 inline-flex items-center justify-center rounded-r-lg hover:bg-gray-50 focus:outline-none cursor-pointer"
                                                            aria-label="Increase quantity"
                                                            title="Increase"
                                                        >
                                                            <FiPlus size={16} className="text-gray-700" />
                                                        </button>
                                                    </div>
                                                    {/* Total */}
                                                    <div className="text-right md:hidden">
                                                        <del className="block text-xs text-gray-400">Rs.{item.original_price * countQuantity}</del>
                                                        <span className="block text-sm font-semibold text-gray-900">
                                                            Rs.{item.final_price * countQuantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="md:col-span-2 flex items-center justify-between md:justify-end max-md:hidden">
                                                <div className="text-right">
                                                    <del className="block text-xs text-gray-400">Rs.{item.original_price * countQuantity}</del>
                                                    <span className="block text-sm font-semibold text-gray-900">
                                                        Rs.{item.final_price * countQuantity}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                                                <div className="hidden md:block md:ml-4">
                                                    <DeleteToggle
                                                        id={item._id}
                                                        final_price={item.final_price}
                                                        original_price={item.original_price}
                                                        user_id={user?.data?._id}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                        <FiShoppingCart size={22} aria-hidden="true" />
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                                    <p className="mt-1 text-sm text-gray-500">Browse products and add your favorites to the cart.</p>
                                    <Link
                                        href="/store"
                                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        Continue shopping
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Summary */}
                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Voucher */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900">Have a voucher?</h2>
                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <label htmlFor="voucher" className="sr-only">
                                        Voucher code
                                    </label>
                                    <input
                                        id="voucher"
                                        type="text"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter code"
                                    />
                                    <button
                                        type="button"
                                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <div className="flex items-center gap-2">
                                            <del className="text-gray-400">Rs.{cartOriginalPrice}</del>
                                            <span className="font-medium text-gray-900">Rs.{cartFinalPrice}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Shipping fee</span>
                                        <span className="font-medium text-gray-900">Rs.{shippingFee}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Coupon</span>
                                        <span className="font-medium text-gray-900">No</span>
                                    </div>
                                    <div className="my-2 border-t border-gray-200"></div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-gray-900">TOTAL</span>
                                        <span className="text-xl font-bold text-gray-900" aria-live="polite">
                                            Rs.{total}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={checkoutHandler}
                                    type="button"
                                    className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    Check out
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
