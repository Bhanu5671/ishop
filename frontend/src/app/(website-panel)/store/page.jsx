"use client"

import Link from "next/link"
import { getProductData } from "@/app/library/api-call"
import AddToCart from "@/app/component/website/AddToCart"
import WishList from "@/app/component/website/WishList"
import { FiCheckCircle, FiAlertCircle, FiTag } from "react-icons/fi"
import React, { useEffect, useState } from "react"

export default function Store({ searchParams }) {

    const [limit, setLimit] = useState(12);
    const [productJSON, setProductJSON] = useState(null);
    const { sortByName, sortByDate, sortByPrice, show, color, min, max } = React.use(searchParams)

    const fetchProducts = async () => {
        const data = await getProductData(
            null,
            true,
            null,
            limit,
            sortByName ?? null,
            sortByPrice ?? null,
            sortByDate ?? null,
            show ?? null,
            color ?? null,
            min ?? null,
            max ?? null,
        );
        console.log("Product Jsn", data)
        setProductJSON(data);
    };



    const loadMoreProduct = () => {
        setLimit(prev => prev + 12);
    };


    useEffect(() => {
        fetchProducts();
    }, [limit, searchParams]);

    useEffect(() => {
        fetchProducts();
    }, []);

    console.log("Produuct Limit", productJSON?.limit)

    const productData = productJSON?.products || [];



    console.log("Product Data", productData)

    return (
        <div className="px-4 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productJSON && productData?.length > 0 ? (
                    productData.map((product) => (
                        <div
                            key={product._id}
                            className="group relative overflow-hidden rounded-xl border border-gray-300 bg-card/50 shadow-sm transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="relative flex aspect-[4/3] items-center justify-center bg-muted pt-2">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${product.main_image}`}
                                    alt={product.name}
                                    className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                />

                                <div className="absolute left-3 top-3">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${product.stock
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-rose-200 bg-rose-50 text-rose-700"
                                            }`}
                                    >
                                        {product.stock ? (
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
                                    <WishList product={product} />
                                </div>
                            </div>

                            <div className="p-4">
                                <Link href={`/product/${product._id}`} className="block">
                                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="mt-3 flex flex-col items-center gap-3 sm:items-start">
                                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                        <FiTag className="h-4 w-4 text-primary" aria-hidden="true" />
                                        <span className="text-lg font-bold text-foreground">Rs.{product.final_price}</span>
                                        <span className="text-sm text-gray-500 font-semibold text-muted-foreground line-through">
                                            Rs.{product.original_price}
                                        </span>
                                        <span className="text-xs font-medium text-amber-600">({product.discount_percentage}% OFF)</span>
                                    </div>

                                    <div className="w-full">
                                        <AddToCart product={product} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <div className="mx-auto max-w-md rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
                            <FiAlertCircle className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
                            <h3 className="mt-4 text-base font-semibold text-foreground">No products found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center mt-8">
                {/* Primary black for load more */}
                {productJSON?.total >= 12 && <button
                    className="bg-black text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-black/90 transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                    onClick={() => { loadMoreProduct() }}
                >
                    Load More Products
                </button>}
            </div>
        </div>


    )
}
