"use client"

import React, { useState } from "react";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { axiosApiInstance } from "../library/helper";
import { useSearchParams, useRouter } from "next/navigation";



export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [error, setError] = useState({ confirmPassword: "" }, { password: "" }, { email: "" });
    const lsCart = localStorage.getItem("cart");
    const cart = lsCart ? JSON.parse(lsCart) : null;

    console.log("Cart item In Local", cart)

    const router = useRouter();
    const param = useSearchParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            const email = e.target.email.value;
            const password = e.target.password.value;

            axiosApiInstance.post("/user/login", { email, password }).then(
                async (response) => {
                    if (response.data.flag == 1) {
                        console.log(response.data.message)

                        const cartResponse = await axiosApiInstance.post("/cart/move-ls-to-cart", {
                            user_id: response.data.existingUser._id,
                            cart_items: cart != null ? cart.items : []
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
                        localStorage.setItem("cart", JSON.stringify({
                            items: final_data, original_price, final_price
                        }))
                        console.log("Login Se Cart", cartResponse.data)


                        const userData = {
                            user: response.data.existingUser,
                            token: response.data.token,
                            loginAt: new Date(),
                        }
                        localStorage.setItem("user", JSON.stringify(userData));
                        if (param.has("ref")) {
                            if (param.get("ref") == "checkout") {
                                router.push("/checkout")
                            } else if (param.get("ref") == "header") {
                                router.push("/")
                            }
                        }
                    } else {
                        setError({ ...error, email: response.data.emailError, password: response.data.passwordError })
                        console.log(response.data.message)
                    }
                }
            ).catch(
                (error) => {
                    console.log(error)
                }
            )
        } else {
            const name = e.target.name.value;
            const email = e.target.email.value;
            const password = e.target.password.value;
            const confirmPassword = e.target.confirmPassword.value

            axiosApiInstance.post("/user/register", { name, email, password, confirmPassword }).then(
                async (response) => {
                    if (response.data.flag == 1) {
                        console.log(response.data.message)

                        const cartResponse = await axiosApiInstance.post("/cart/move-ls-to-cart", {
                            user_id: response.data.existingUser._id,
                            cart_items: cart != null ? cart.items : []
                        })
                        console.log("Login Se Cart", cartResponse.data)

                        const userData = {
                            user: response.data.user,
                            token: response.data.token,
                            loginAt: new Date(),
                        }
                        localStorage.setItem("user", JSON.stringify(userData));
                        if (param.has("ref")) {
                            if (param.get("ref") == "checkout") {
                                router.push("/checkout")
                            } else if (param.get("ref") == "header") {
                                router.push("/")
                            }
                        }
                    } else {
                        setError({ ...error, confirmPassword: response.data.confirmPasswrdError, email: response.data.emailError, password: response.data.passwordError })
                        console.log(response.data.message)
                    }
                }
            ).catch(
                (error) => {
                    console.log(error)
                }
            )
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex justify-center mb-6">
                    <IoPersonOutline fontSize={30} color="black" />
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    {isLogin ? "Welcome Back!" : "Create Account"}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {isLogin
                        ? "Login to your account"
                        : "Sign up to get started with Ishop"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="cursor-pointer">
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Your Name"
                            />
                        </div>
                    )}
                    <div className="cursor-pointer">
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="you@example.com"
                        />
                        {error.email === "" ? <span>{""}</span> : <span className="text-red-500 text-xs">{error.email}</span>}
                    </div>
                    <div className="cursor-pointer">
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="********"
                        />
                        {error.password === "" ? <span>{""}</span> : <span className="text-red-500 text-xs">{error.password}</span>}
                    </div>
                    {!isLogin && (
                        <div className="cursor-pointer">
                            <label className="block text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="********"
                            />
                            {error.confirmPassword === "" ? <span>{""}</span> : <span className="text-red-500 text-xs">{error.confirmPassword}</span>}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-pink-400 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-pink-500 transition-all cursor-pointer"
                    >
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                    <FcGoogle fontSize={25} />
                    <span className="text-gray-700 font-medium">
                        Continue with Google
                    </span>
                </button>
                <p className="text-center text-gray-600 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="text-blue-500 hover:underline font-semibold cursor-pointer"
                        onClick={() => setIsLogin(!isLogin)}
                        type="button"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}