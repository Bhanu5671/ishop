"use client"
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { FaCartArrowDown } from "react-icons/fa";
import { addItem, saveCartToLocalStorage } from '@/redux/features/cartSlice';
import { axiosApiInstance } from '@/app/library/helper';
import Link from 'next/link';
export default function AddToCart({ product }) {
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(true)

    const lsUser = localStorage.getItem("user");
    const user = lsUser ? JSON.parse(lsUser) : null

    const addToCartHandler = async () => {
        if (user?.user != null) {
            const cartResponse = await axiosApiInstance.post("/cart/move-ls-to-cart", {
                user_id: user.user._id,
                cart_items: [{ productId: product._id, quantity: 1 }]
            })
            let final_price = 0, original_price = 0;
            const final_data = cartResponse.data.final_user_cart.map(
                (items) => {
                    original_price += Number(items.product_id.original_price * items.qty)
                    final_price += Number(items.product_id.final_price * items.qty)
                    return {
                        productId: items.product_id._id,
                        quantity: items.qty,
                    }
                }
            )
            console.log("Final Cart Data came from server", final_data)
            localStorage.setItem("cart", JSON.stringify({
                items: final_data, original_price, final_price
            }))
            dispatch(saveCartToLocalStorage());
        }
        else {
            dispatch(addItem({ productId: product._id, final_price: product.final_price, original_price: product.original_price }));
        }
        setToggle(false)
    };

    return (
        <div>
            {toggle == true ? <button onClick={addToCartHandler} className='px-3 py-3 flex items-center justify-center gap-2 text-md m-auto shadow-sm bg-black text-white rounded-md cursor-pointer w-full'>
                <FaCartArrowDown />
                <span>Add to Cart</span>
            </button> : <Link href={"/cart"} className='px-3 py-3 flex items-center justify-center gap-2 text-sm m-auto shadow-sm bg-black text-white rounded-md mt-3 cursor-pointer'>
                <FaCartArrowDown />
                <span>Go to Cart</span>
            </Link>}
        </div>
    )
}
