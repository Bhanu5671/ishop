"use client"

import {
    FaStar,
    FaRegStar,
    FaRegHeart,
    FaPlus,
    FaMinus,
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaFacebookF,
    FaTwitter,
    FaPinterest,
    FaInstagram,
    FaChevronLeft,
    FaChevronRight,
    FaCheck,
} from "react-icons/fa"
import React, { useEffect, useState } from "react"
import { axiosApiInstance } from "@/app/library/helper"
import AddToCart from "@/app/component/website/AddToCart"
import ReviewSection from "@/app/component/website/ReviewSection"
import parse from "html-react-parser"
import Link from "next/link"
import WishList from "@/app/component/website/WishList"

export default function ProductPage({ params }) {
    const { product_id } = React.use(params)
    const [productData, setProductData] = useState(null)
    const [relatedproductData, setRelatedProductData] = useState(null)
    const [selectedImage, setSelectedImage] = useState(-1)
    const [selectedColor, setSelectedColor] = useState("Black")
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const fetchData = () => {
        axiosApiInstance
            .get(`/product/get-data/${product_id}`)
            .then((response) => {
                if (response.data.flag == 1) {
                    setProductData(response.data.product)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchRelatedProduct = () => {
        axiosApiInstance
            .get(
                `/product/get-related-products?category_id=${productData.category_id._id}&exclude_id=${productData._id}&limit=8`,
            )
            .then((response) => {
                if (response.data.flag == 1) {
                    setRelatedProductData(response.data.relatedProducts)
                    console.log(response.data.relatedProducts)
                } else {
                    console.log(response.data.error)
                }
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    console.log("Related Product", relatedproductData)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (productData?.category_id?._id) {
            fetchRelatedProduct()
        }
    }, [productData])

    const averageRating =
        productData?.review != null
            ? productData?.review?.reduce((acc, review) => acc + review.rating, 0) / productData?.review?.length
            : null

    console.log("Product Data", productData)
    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-yellow-400" />)
        }
        const remainingStars = 5 - Math.ceil(rating)
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />)
        }

        return stars
    }

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Breadcrumb */}
            <div className="bg-neutral-100/80 border-b border-neutral-200">
                <div className="container mx-auto px-4 py-3">
                    <nav className="text-xs md:text-sm text-neutral-600">
                        <span className="hover:text-neutral-900 transition-colors">
                            <Link href={"/"}>Home</Link>
                        </span>
                        <span className="mx-2 text-neutral-400">{"/"}</span>
                        <span className="hover:text-neutral-900 transition-colors">
                            <Link href={"/store"}>Store</Link>
                        </span>
                        <span className="mx-2 text-neutral-400">{"/"}</span>
                        <span className="capitalize">{productData?.category_id?.name}</span>
                        <span className="mx-2 text-neutral-400">{"/"}</span>
                        <span className="text-neutral-900 font-medium">{productData?.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Section */}
            <div className="container mx-auto px-4 py-8 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="group relative rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden p-4">
                            <img
                                src={
                                    selectedImage == -1
                                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${productData?.main_image}`
                                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/other-images/${productData?.other_images[selectedImage]}`
                                }
                                alt={productData?.name}
                                className="w-full h-[22rem] md:h-[28rem] lg:h-[32rem] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            {/* wishlist */}
                            <div className="absolute top-4 right-4">
                                <WishList product={productData} />
                            </div>
                            {/* discount badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-sm">
                                    {productData?.discount_percentage}% OFF
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedImage(-1)}
                                className={`w-20 h-20 rounded-xl bg-white border ${selectedImage === -1 ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-neutral-200"} overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer`}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${productData?.main_image}`}
                                    alt={productData?.name}
                                    className="w-full h-full object-contain"
                                />
                            </button>
                            {productData?.other_images.length > 0 &&
                                productData?.other_images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-xl bg-white border ${selectedImage === index ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-neutral-200"} overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer`}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/other-images/${image}`}
                                            alt={productData?.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 md:p-6">
                            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-balance mb-3">
                                {productData?.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                                {productData?.review.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        {renderStars(averageRating)}
                                        <span className="text-neutral-600 ml-2 text-sm">({averageRating})</span>
                                        <span className="text-neutral-300">{"|"}</span>
                                    </div>
                                )}
                                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">
                                    In Stock
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                <span className="text-lg md:text-xl font-bold text-neutral-900">Rs.{productData?.final_price}</span>
                                <span className="text-sm md:text-md text-neutral-400 line-through">
                                    Rs.{productData?.original_price}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                                    Save Rs.{productData?.original_price - productData?.final_price}
                                </span>
                            </div>

                            {/* Product Options */}
                            <div className="space-y-6 mt-6">
                                {/* Color Selection */}
                                <div>
                                    <h3 className="text-sm md:text-base font-medium mb-3 capitalize">Color: {selectedColor}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {productData?.colors?.map((color) => (
                                            <button
                                                key={color?._id}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ${selectedColor === color ? "border-neutral-900" : "border-neutral-200 cursor-pointer"} shadow-sm`}
                                                style={{ background: color?.hexacode }}
                                                aria-label={`Select ${color?.name}`}
                                            >
                                                {selectedColor === color.name && (
                                                    <FaCheck
                                                        className={`m-auto text-sm ${color === "White" ? "text-neutral-800" : "text-white"}`}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity
                                <div>
                                    <h3 className="text-sm md:text-base font-medium mb-3">Quantity</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-xs">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-2.5 hover:bg-neutral-50"
                                            >
                                                <FaMinus className="text-neutral-700" />
                                            </button>
                                            <span className="px-4 py-2 font-medium min-w-8 text-center">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-neutral-50">
                                                <FaPlus className="text-neutral-700" />
                                            </button>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Action Buttons */}
                                <div className="flex gap-3 md:gap-4 max-md:flex-col">
                                    <div className="w-full max-md:w-full">
                                        <AddToCart product={productData} className="mt-0" />
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-6 border-t border-neutral-200">
                                    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm cursor-pointer">
                                        <FaTruck className="text-neutral-900 text-xl" />
                                        <div>
                                            <p className="font-medium">Free Shipping</p>
                                            <p className="text-sm text-neutral-600">On orders over Rs.500</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm cursor-pointer">
                                        <FaShieldAlt className="text-neutral-900 text-xl" />
                                        <div>
                                            <p className="font-medium">2 Year Warranty</p>
                                            <p className="text-sm text-neutral-600">Official warranty</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm cursor-pointer">
                                        <FaUndo className="text-neutral-900 text-xl" />
                                        <div>
                                            <p className="font-medium">30 Day Returns</p>
                                            <p className="text-sm text-neutral-600">Easy returns</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Share */}
                                <div className="flex items-center gap-4 pt-2">
                                    <span className="text-neutral-600 text-sm">Share:</span>
                                    <div className="flex gap-2">
                                        <button className="p-2.5 rounded-full border border-neutral-200 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                            <FaFacebookF />
                                        </button>
                                        <button className="p-2.5 rounded-full border border-neutral-200 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                            <FaTwitter />
                                        </button>
                                        <button className="p-2.5 rounded-full border border-neutral-200 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                            <FaPinterest />
                                        </button>
                                        <button className="p-2.5 rounded-full border border-neutral-200 text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                            <FaInstagram />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 md:p-6 overflow-hidden">
                            {productData?.description.length > 0 && (
                                <div className="prose max-w-none">
                                    <h3 className="text-xl md:text-2xl font-semibold mb-4 pb-2 border-b border-neutral-200">
                                        Product Description
                                    </h3>
                                    {productData?.description.length > 0 && parse(productData?.description)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedproductData != null && (
                    <div className="mt-12 md:mt-16">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Related Products</h2>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                    <FaChevronLeft />
                                </button>
                                <button className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-white shadow-sm transition cursor-pointer">
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                            {relatedproductData.map((product) => (
                                <Link
                                    href={`/product/${product._id}`}
                                    key={product._id}
                                    className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 flex flex-col gap-2 cursor-pointer"
                                >
                                    <div className="relative mb-3">
                                        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product.main_image}`}
                                                alt={product.name}
                                                className="w-full h-44 object-contain"
                                            />
                                        </div>
                                        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm border border-neutral-200 hover:bg-neutral-900 hover:text-white transition">
                                            <FaRegHeart className="text-current" />
                                        </button>
                                        <div className="absolute top-0 left-0">
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[11px] font-medium shadow-sm">
                                                {product?.discount_percentage}% OFF
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-sm md:text-base line-clamp-2 text-neutral-900">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base md:text-lg font-semibold text-neutral-900">
                                            Rs.{product.final_price}
                                        </span>
                                        <span className="text-xs md:text-sm text-neutral-400 line-through">
                                            Rs.{product.original_price}
                                        </span>
                                    </div>
                                    <div className="w-full">
                                        <AddToCart product={product} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-12 md:mt-16">
                    <ReviewSection product={productData} />
                </div>
            </div>
        </div>
    )
}
