"use client"

import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify"
import { axiosApiInstance } from "@/app/library/helper";
import { FaHeart } from "react-icons/fa";
import { saveWishlistToLocalStorage, setWishlist, removeWishlist } from '@/redux/features/wishlistSlice';

export default function WishList({ product }) {

    const user = useSelector((store) => store.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const wishlist = useSelector((store) => store.wishlist);

    const fetchWishListData = () => {
        axiosApiInstance.get(`/wishlist/get-wishlist/${user?.data?._id}`).then(
            (response) => {
                if (response.data.flag == 1) {
                    const data = {
                        user: user?.data,
                        product: response.data.wishListProduct.map(item => item.product)
                    }
                    localStorage.setItem('wishlist', JSON.stringify(data));
                    dispatch(saveWishlistToLocalStorage());
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    const isWishListed = wishlist.product.some(item => item._id === product?._id);

    const wishListHandler = () => {
        if (user?.data != null) {
            const data = {
                user_id: user?.data?._id,
                product_id: product?._id
            }

            if (!isWishListed) {
                axiosApiInstance.post("/wishlist/add-product", data).then(
                    (response) => {
                        if (response.data.flag == 1) {
                            toast.success(response.data.message)
                            // Update the Redux store with the new wishlist state
                            dispatch(setWishlist({ user: user?.data, product: product }));
                            dispatch(saveWishlistToLocalStorage());
                        } else {
                            toast.error(response.data.message)
                        }
                    }
                ).catch(
                    (error) => {
                        console.log(error.message)
                    }
                )
            } else {
                axiosApiInstance.delete("/wishlist/remove-product", {
                    data: data
                }).then(
                    (response) => {
                        if (response.data.flag == 1) {
                            toast.success(response.data.message)
                            // Update the Redux store with the new wishlist state
                            dispatch(removeWishlist({ user: user?.data, product: product }));
                            dispatch(saveWishlistToLocalStorage());
                        } else {
                            toast.error(response.data.message)
                        }
                    }
                ).catch(
                    (error) => {
                        console.log(error.message)
                    }
                )
            }
        } else {
            router.push("/login?ref=wishlist");
        }
    }

    useEffect(() => {
        if (user?.data != null) {
            fetchWishListData();
        }
    }, [])


    return (
        <div className=''>
            <button
                onClick={() => wishListHandler()}
                className="bg-white rounded-full shadow-md hover:shadow-lg transition-shadow p-[5px] cursor-pointer "
            >
                {isWishListed ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
            </button>
        </div>
    )
}
