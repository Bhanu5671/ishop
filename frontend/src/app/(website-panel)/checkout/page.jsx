"use client"
import { useEffect, useState } from "react"
import { axiosApiInstance } from "@/app/library/helper"
import {
    FaHome,
    FaShoppingCart,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaCreditCard,
    FaShieldAlt,
    FaCheck,
    FaLock,
} from "react-icons/fa"
import { FiEdit3, FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { clearCart } from "@/redux/features/cartSlice"
import { saveUserToLocalStorage } from "@/redux/features/userSlice"
import { toast } from "react-toastify"
import Link from "next/link"
import { useRazorpay } from "react-razorpay";


export default function CheckoutPage() {
    const { Razorpay } = useRazorpay();
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [productInCheckout, setProductInCheckout] = useState([])
    const [showAddressPopup, setShowAddressPopup] = useState(false)
    const [showEditAddressPopup, setShowEditAddressPopup] = useState(false)
    const [indexForEdit, setIndexForEdit] = useState(0)

    console.log("Edit Idex", indexForEdit)

    const cartItems = useSelector((store) => store.cart.items)
    const cartFinalPrice = useSelector((store) => store.cart.final_price)
    const cartOriginalPrice = useSelector((store) => store.cart.original_price)
    const user = useSelector((store) => store.user)
    const dispatch = useDispatch()
    const router = useRouter()

    const defaultAddressIndex = user?.data?.address?.findIndex((addr) => addr.isdefault) ?? 0
    const [selectedAddress, setSelectedAddress] = useState(defaultAddressIndex)

    useEffect(() => {
        saveUserToLocalStorage()
    }, [])

    const handleDeleteAddress = (index, user_id) => {
        if (user.data != null) {
            axiosApiInstance
                .delete(`/user/delete-address/${index}`, {
                    data: { user_id },
                })
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        const lsUser = localStorage.getItem("user")
                        const finalLsUser = lsUser ? JSON.parse(lsUser) : []
                        finalLsUser.user.address = response.data.new_User.address
                        localStorage.setItem("user", JSON.stringify(finalLsUser))
                        dispatch(saveUserToLocalStorage())
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    console.log("User in checkoyt", user)

    const ids = cartItems.map((item) => item.productId).join("-")

    const fetchData = () => {
        if (cartItems.length === 0) return
        axiosApiInstance
            .get(`/product/get-data-by-ids/${ids}`)
            .then((response) => {
                console.log(response.data)
                setProductInCheckout(response.data.products)
            })
            .catch((error) => {
                console.error("Error fetching product data:", error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [cartItems])

    const getItemCount = (pId) => {
        const item = cartItems.find((item) => item.productId === pId)
        console.log("getitem function", item)
        return item ? item.quantity : 0
    }

    const subtotal = cartFinalPrice
    const shippingFee = 20
    const total = subtotal + shippingFee

    const addressSubmitHandler = (e) => {
        e.preventDefault()
        const data = {
            name: e.target.name.value,
            street: e.target.street.value,
            area: e.target.area.value,
            landmark: e.target.landmark.value,
            pincode: e.target.pincode.value,
            city: e.target.city.value,
            state: e.target.state.value,
            mobile: e.target.mobile_number.value,
            isDefault: e.target.isDefault.checked,
            user_id: user.data._id,
        }
        console.log("data", data)
        if (user.data != null) {
            axiosApiInstance
                .post("/user/save-address", data)
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        setShowAddressPopup(false)
                        console.log(response.data)
                        const lsUser = localStorage.getItem("user")
                        const finalLsUser = lsUser ? JSON.parse(lsUser) : []
                        finalLsUser.user.address = response.data.new_user.address
                        localStorage.setItem("user", JSON.stringify(finalLsUser))
                        dispatch(saveUserToLocalStorage())
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const handleSetDefault = (index, user_id) => {
        const data = {
            index: index,
            user_id: user_id,
        }
        if (user.data != null) {
            axiosApiInstance
                .patch("/user/setdefault-address", data)
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        setSelectedAddress(data.index)
                        console.log(response.data)
                        const lsUser = localStorage.getItem("user")
                        const finalLsUser = lsUser ? JSON.parse(lsUser) : []
                        finalLsUser.user.address = response.data.new_user.address
                        localStorage.setItem("user", JSON.stringify(finalLsUser))
                        dispatch(saveUserToLocalStorage())
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const addressEditSubmitHandler = (e, index, user_id) => {
        const data = {
            index: index,
            user_id: user_id,
            name: e.target.name.value,
            street: e.target.street.value,
            area: e.target.area.value,
            landmark: e.target.landmark.value,
            pincode: e.target.pincode.value,
            city: e.target.city.value,
            state: e.target.state.value,
            mobile: e.target.mobile_number.value,
        }
        axiosApiInstance
            .put("/user/edit-address", data)
            .then((response) => {
                if (response.data.flag == 1) {
                    toast.success(response.data.message)
                    console.log(response.data)
                    setSelectedAddress(response.data.new_user)
                    const lsUser = localStorage.getItem("user")
                    const finalLsUser = lsUser ? JSON.parse(lsUser) : []
                    finalLsUser.user = response.data.new_user
                    localStorage.setItem("user", JSON.stringify(finalLsUser))
                    dispatch(saveUserToLocalStorage())
                } else {
                    toast.error(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handlePlaceOrder = () => {
        console.log("User Id", user.data._id)
        const data = {
            shipping_address: user.data.address[selectedAddress],
            payment_method: paymentMethod,
            user_id: user.data._id,
            order_total: cartFinalPrice,
        }
        console.log("data", data)
        console.log(user.token)
        axiosApiInstance
            .post("/order/create", data, {
                headers: {
                    Authorization: user.token,
                },
            })
            .then((response) => {
                if (response.data.flag == 1) {
                    if (paymentMethod == 0) {
                        dispatch(clearCart())
                        router.push(`/thank-you/${response.data.order_id}`)
                    } else {
                        const options = {
                            key: process.env.NEXT_PUBLIC_KEY_ID, // Enter the Key ID generated from the Dashboard
                            currency: "INR",
                            name: "ISHOP",
                            order_id: response.data.razorpay_order_id, // Generate order_id on server
                            handler: (razorpay_response) => {
                                const data = {
                                    razorpay_response,
                                    order_id: response.data.order_id,
                                    user_id: user.data._id
                                }
                                axiosApiInstance.post("/order/success", data, {
                                    headers: {
                                        Authorization: user.token,
                                    },
                                }).then((response) => {
                                    if (response.data.flag == 1) {
                                        toast.success("Payment Successful")
                                        dispatch(clearCart())
                                        router.push(`/thank-you/${response.data.order_id}`)
                                    } else {
                                        toast.error(response.data.message)
                                    }
                                })
                            },
                            prefill: {
                                name: user?.data?.name,
                            },
                            theme: {
                                color: "#F37254",
                            },
                        };

                        const razorpayInstance = new Razorpay(options);
                        razorpayInstance.open();

                        // razorpayInstance.error(
                        //     (razorpay_error) => {
                        //         console.log(razorpay_error)
                        //     }
                        // )
                    }
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaHome className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            <Link href={"/"} className="hidden sm:inline">Home</Link>
                            <span aria-hidden="true">/</span>
                            <FaShoppingCart className="h-4 w-4 text-gray-500" aria-hidden="true" />
                            <Link href={"/cart"} className="hidden sm:inline">Cart</Link>
                            <span aria-hidden="true">/</span>
                            <span className="font-medium text-gray-900">Checkout</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#155dfc]/10 px-3 py-1 text-xs font-medium text-[#155dfc]">
                            <FaLock className="h-3.5 w-3.5" aria-hidden="true" />
                            Secure checkout
                        </div>
                    </div>

                    {/* Simple step display (static UI, no logic change) */}
                    <ol className="flex items-center gap-4 pb-4 text-xs sm:text-sm">
                        <li className="">
                            <Link href={"/cart"} className="flex items-center gap-2 text-[#155dfc]">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#155dfc]/15">
                                    <FaCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                                Cart</Link>
                        </li>
                        <li className="text-gray-400" aria-hidden="true">
                            —
                        </li>
                        <li className="flex items-center gap-2 text-[#155dfc]">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#155dfc]/15">2</span>
                            Address
                        </li>
                        <li className="text-gray-400" aria-hidden="true">
                            —
                        </li>
                        <li className="flex items-center gap-2 text-gray-500">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">3</span>
                            Payment
                        </li>
                    </ol>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Address + Payment */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Addresses */}
                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <FaMapMarkerAlt className="h-5 w-5 text-[#155dfc]" aria-hidden="true" />
                                    Select Delivery Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {user?.data != null ? (
                                        user.data.address.map((address, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-start gap-3 rounded-lg border p-4 transition-all ${selectedAddress == index
                                                    ? "border-[#155dfc] bg-[#155dfc]/10"
                                                    : "border-gray-200 hover:shadow-sm"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`address-${index}`}
                                                    name="selectedAddress"
                                                    value={index}
                                                    checked={selectedAddress === index}
                                                    onChange={() => setSelectedAddress(index)}
                                                    className={`h-4 w-4 rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] ${selectedAddress === index ? "border-[#155dfc] bg-[#155dfc]" : "border-gray-300"
                                                        }`}
                                                    aria-label={`Select address ${index + 1}`}
                                                />
                                                <label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className="font-medium text-gray-900">{address.name}</span>
                                                        {address.isdefault && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#155dfc] px-2 py-1 text-xs font-medium text-white">
                                                                <FaCheck className="h-3 w-3" aria-hidden="true" />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600 text-pretty leading-relaxed">
                                                        <p className="sm:hidden">
                                                            {address.street}, {address.area}
                                                        </p>
                                                        <p className="sm:hidden">
                                                            {address.landmark}, {address.city}, {address.state}
                                                        </p>
                                                        <p className="hidden sm:block">
                                                            {address.street}, {address.area}, {address.landmark}, {address.city}, {address.state}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600">{address.mobile}</p>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    {!address.isdefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(index, user.data._id)}
                                                            className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
                                                            type="button"
                                                        >
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setShowEditAddressPopup(true)
                                                            setIndexForEdit(index)
                                                        }}
                                                        className="cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#155dfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
                                                        aria-label="Edit address"
                                                        type="button"
                                                    >
                                                        <FiEdit3 className="h-5 w-5" aria-hidden="true" />
                                                    </button>

                                                    {showEditAddressPopup && (
                                                        <div
                                                            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 p-6 backdrop-blur-sm"
                                                            role="dialog"
                                                            aria-modal="true"
                                                        >
                                                            <div className="relative w-full max-w-md animate-fadeIn rounded-xl bg-white p-6 shadow-2xl">
                                                                <button
                                                                    className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                                                    onClick={() => setShowEditAddressPopup(false)}
                                                                    aria-label="Close edit address"
                                                                    type="button"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <div className="mb-6 flex items-center gap-2">
                                                                    <FaMapMarkerAlt className="h-6 w-6 text-[#155dfc]" aria-hidden="true" />
                                                                    <h3 className="text-2xl font-bold text-gray-900">Edit Address</h3>
                                                                </div>
                                                                <form
                                                                    className="space-y-4"
                                                                    onSubmit={(e) => addressEditSubmitHandler(e, indexForEdit, user.data._id)}
                                                                >
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].name}
                                                                            name="name"
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Street</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].street}
                                                                            name="street"
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Area</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].area}
                                                                            name="area"
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Landmark</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].landmark}
                                                                            name="landmark"
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">PinCode</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].zipcode}
                                                                            name="pincode"
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700">City</label>
                                                                            <input
                                                                                type="text"
                                                                                defaultValue={user.data.address[indexForEdit].city}
                                                                                name="city"
                                                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700">State</label>
                                                                            <input
                                                                                type="text"
                                                                                defaultValue={user.data.address[indexForEdit].state}
                                                                                name="state"
                                                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={user.data.address[indexForEdit].mobile}
                                                                            name="mobile_number"
                                                                            maxLength={10}
                                                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="submit"
                                                                        className="w-full cursor-pointer rounded-lg bg-[#155dfc] px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-[#0f4be0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
                                                                    >
                                                                        Save Address
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteAddress(index, user.data._id)}
                                                        className="cursor-pointer rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                                        aria-label="Delete address"
                                                        type="button"
                                                    >
                                                        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-lg font-medium text-amber-600">Please Login First</div>
                                    )}
                                </div>

                                {/* Add New Address Button */}
                                <button
                                    onClick={() => setShowAddressPopup(true)}
                                    className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
                                    type="button"
                                >
                                    <FaMapMarkerAlt className="h-4 w-4" aria-hidden="true" />
                                    Add New Address
                                </button>
                            </div>
                        </section>

                        {/* Address Popup Modal */}
                        {showAddressPopup && (
                            <div
                                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 p-6 backdrop-blur-sm"
                                role="dialog"
                                aria-modal="true"
                            >
                                <div className="relative w-full max-w-md animate-fadeIn rounded-xl bg-white p-6 shadow-2xl">
                                    <button
                                        className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                        onClick={() => setShowAddressPopup(false)}
                                        aria-label="Close add address"
                                        type="button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="mb-6 flex items-center gap-2">
                                        <FaMapMarkerAlt className="h-6 w-6 text-[#155dfc]" aria-hidden="true" />
                                        <h3 className="text-2xl font-bold text-gray-900">Add New Address</h3>
                                    </div>
                                    <form className="space-y-4" onSubmit={addressSubmitHandler}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Street</label>
                                            <input
                                                type="text"
                                                name="street"
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Area</label>
                                            <input
                                                type="text"
                                                name="area"
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Landmark</label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">PinCode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">State</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                            <input
                                                type="text"
                                                name="mobile_number"
                                                maxLength={10}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                id="defaultAddress"
                                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#155dfc] focus:ring-[#155dfc]"
                                            />
                                            <label htmlFor="defaultAddress" className="text-sm text-gray-700">
                                                Set as default address
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full cursor-pointer rounded-lg bg-[#155dfc] px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-[#0f4be0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]"
                                        >
                                            Save Address
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <FaCreditCard className="h-5 w-5 text-[#155dfc]" aria-hidden="true" />
                                    Payment Method
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <label
                                        htmlFor="cod"
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 0}
                                            onChange={() => setPaymentMethod(0)}
                                            className="h-4 w-4 border-gray-300 text-[#155dfc] focus:ring-[#155dfc]"
                                        />
                                        <FaMoneyBillWave className="h-5 w-5 text-amber-500" aria-hidden="true" />
                                        <div>
                                            <div className="font-medium text-gray-900">Cash on Delivery</div>
                                            <div className="text-sm text-gray-600">Pay when you receive your order</div>
                                        </div>
                                    </label>

                                    <label
                                        htmlFor="razorpay"
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <input
                                            type="radio"
                                            id="razorpay"
                                            name="paymentMethod"
                                            value="razorpay"
                                            checked={paymentMethod === 1}
                                            onChange={() => setPaymentMethod(1)}
                                            className="h-4 w-4 border-gray-300 text-[#155dfc] focus:ring-[#155dfc]"
                                        />
                                        <FaShieldAlt className="h-5 w-5 text-[#155dfc]" aria-hidden="true" />
                                        <div>
                                            <div className="font-medium text-gray-900">Razorpay</div>
                                            <div className="text-sm text-gray-600">Secure online payment</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <FaShoppingCart className="h-5 w-5 text-[#155dfc]" aria-hidden="true" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="space-y-4 p-6">
                                {/* Cart Items */}
                                <div className="space-y-4">
                                    {productInCheckout.map((item) => {
                                        const countQuantity = getItemCount(item._id)
                                        return (
                                            <div key={item._id} className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${item.main_image}`}
                                                    alt={item.name}
                                                    className="h-16 w-16 rounded-md object-contain"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium leading-tight text-gray-900">{item.name}</h4>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">Qty: {countQuantity}</span>
                                                        <span className="flex items-center justify-end gap-2">
                                                            <span className="text-[14px] font-medium text-gray-400 line-through">
                                                                Rs.{item.original_price * countQuantity}
                                                            </span>
                                                            <span className="font-semibold text-gray-900">Rs.{item.final_price * countQuantity}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <hr className="border-gray-200" />

                                {/* Order Totals */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span>Rs.{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping fee</span>
                                        <span>Rs.{shippingFee}</span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-[#155dfc]">Rs.{total}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    aria-disabled={paymentMethod == null}
                                    className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-lg font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] ${paymentMethod == null
                                        ? "cursor-not-allowed bg-[#155dfc]/40"
                                        : "cursor-pointer bg-[#155dfc] hover:bg-[#0f4be0]"
                                        }`}
                                >
                                    <FaShieldAlt className="h-5 w-5" aria-hidden="true" />
                                    Place Order
                                </button>

                                <p className="text-center text-xs text-gray-500">
                                    By placing your order, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
