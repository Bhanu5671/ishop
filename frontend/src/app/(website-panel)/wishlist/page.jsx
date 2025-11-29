"use client"
import React, { useEffect, useState } from 'react'
import AddToCart from '@/app/component/website/AddToCart';
import Link from 'next/link';
import WishList from '@/app/component/website/WishList';
import { axiosApiInstance } from '@/app/library/helper';
import { useSelector } from 'react-redux';
import { saveWishlistToLocalStorage } from '@/redux/features/wishlistSlice';
import { useDispatch } from 'react-redux';
import { FiCheckCircle, FiAlertCircle, FiTag } from "react-icons/fi"


export default function wishlist() {

    const [wishlistData, setWishlistData] = useState(null);
    const user = useSelector((store) => store.user);
    const wishlist = useSelector((store) => store.wishlist);
    const dispatch = useDispatch();

    const fetchWishListData = () => {
        axiosApiInstance.get(`/wishlist/get-wishlist/${user?.data?._id}`).then(
            (response) => {
                if (response.data.flag == 1) {
                    setWishlistData(response.data.wishListProduct);
                    const data = {
                        user: user?.data,
                        product: response.data.wishListProduct.map(item => item.product)
                    }
                    localStorage.setItem('wishlist', JSON.stringify(data))
                    dispatch(saveWishlistToLocalStorage());
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(
        () => {
            if (user?.data != null) {
                fetchWishListData();
            }
        }, [wishlist.product]
    )

    return (
        <div className="px-4 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {user?.data != null && wishlistData?.length > 0 ? (
                    wishlistData?.map((item) => (
                        <div
                            key={item.product._id}
                            className="group relative overflow-hidden rounded-xl border border-gray-300 bg-card/50 shadow-sm transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="relative flex aspect-[4/3] items-center justify-center bg-muted pt-2">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${item.product.main_image}`}
                                    alt={item.product.name}
                                    className="max-h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                />

                                <div className="absolute left-3 top-3">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${item.product.stock
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-rose-200 bg-rose-50 text-rose-700"
                                            }`}
                                    >
                                        {item.product.stock ? (
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
                                    <WishList product={item.product} />
                                </div>
                            </div>

                            <div className="p-4">
                                <Link href={`/product/${item.product._id}`} className="block">
                                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                                        {item.product.name}
                                    </h3>
                                </Link>

                                <div className="mt-3 flex flex-col items-center gap-3 sm:items-start">
                                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                        <FiTag className="h-4 w-4 text-primary" aria-hidden="true" />
                                        <span className="text-lg font-bold text-foreground">Rs.{item.product.final_price}</span>
                                        <span className="text-sm text-gray-500 font-semibold text-muted-foreground line-through">
                                            Rs.{item.product.original_price}
                                        </span>
                                        <span className="text-xs font-medium text-amber-600">({item.product.discount_percentage}% OFF)</span>
                                    </div>

                                    <div className="w-full">
                                        <AddToCart product={item.product} />
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
        </div>
    )
}
