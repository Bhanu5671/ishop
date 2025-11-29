"use client"
import Link from 'next/link';
import { axiosApiInstance } from '@/app/library/helper';
import React, { useEffect, useState } from 'react';
import WishList from "@/app/component/website/WishList"
import { FiCheckCircle, FiAlertCircle, FiTag } from "react-icons/fi"
export default function BestSelling() {

    const [productData, setProductData] = useState(null)

    const fetchBestSelling = () => {
        axiosApiInstance.get("/order/best-selling").then(
            (response) => {
                if (response.data.flag == 1) {
                    setProductData(response.data.products)
                    console.log(response.data.products)
                } else {
                    console.log(response.data.message)
                }
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )
    }

    useEffect(
        () => {
            fetchBestSelling();
        }, []
    )



    const [scrollX, setScrollX] = useState(0);
    const scrollRef = React.useRef(null);

    const handleScroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollAmount = 303; // px to scroll per click
        if (direction === "left") {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-balance">Best Selling</h2>
            </div>

            <div className="px-4 py-6 relative">
                <button
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full shadow p-2 hover:bg-white cursor-pointer"
                    onClick={() => handleScroll("left")}
                    aria-label="Scroll Left"
                    style={{ display: productData?.length > 0 ? "block" : "none" }}
                >
                    &#8592;
                </button>
                <button
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full shadow p-2 hover:bg-white cursor-pointer"
                    onClick={() => handleScroll("right")}
                    aria-label="Scroll Right"
                    style={{ display: productData?.length > 0 ? "block" : "none" }}
                >
                    &#8594;
                </button>
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
                    style={{ scrollBehavior: "smooth", scrollbarWidth: 'none' }}
                >
                    {productData?.length > 0 && (
                        productData.map((product) => (
                            <div
                                key={product.product_details._id}
                                className="group relative min-w-[300px] max-w-[260px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-300 bg-card/50 shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="relative flex aspect-[4/3] items-center justify-center bg-muted pt-2">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product.product_details.main_image}`}
                                        alt={product.product_details.name}
                                        className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                    />

                                    <div className="absolute left-3 top-3">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${product.product_details.stock
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-rose-200 bg-rose-50 text-rose-700"
                                                }`}
                                        >
                                            {product.product_details.stock ? (
                                                <>
                                                    <FiCheckCircle className="h-4 w-4" />
                                                    In Stock
                                                </>
                                            ) : (
                                                <>
                                                    <FiAlertCircle className="h-4 w-4" />
                                                    Out of Stock
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="absolute right-3 top-3 z-10">
                                        <WishList product={product.product_details} />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <Link href={`/product/${product.product_details._id}`} className="block">
                                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                                            {product.product_details.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-3 flex flex-col items-center gap-3 sm:items-start">
                                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                            <FiTag className="h-4 w-4 text-primary" aria-hidden="true" />
                                            <span className="text-lg font-bold text-foreground">Rs.{product.product_details.final_price}</span>
                                            <span className="text-sm text-gray-500 font-semibold text-muted-foreground line-through">
                                                Rs.{product.product_details.original_price}
                                            </span>
                                            <span className="text-xs font-medium text-amber-600">({product.product_details.discount_percentage}% OFF)</span>
                                        </div>

                                        {/* <div className="w-full">
                                        <AddToCart product={product} />
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )

}

