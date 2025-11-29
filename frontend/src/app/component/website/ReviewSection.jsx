"use client"

import { useEffect, useState } from "react"
import { FaStar, FaUser, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa"
import { HiOutlineX, HiOutlinePhotograph } from "react-icons/hi"
import { BiSmile, BiMeh, BiFrown } from "react-icons/bi"
import { useSelector } from "react-redux"
import { axiosApiInstance } from "@/app/library/helper"
import { toast } from "react-toastify"

export default function ReviewSection({ product }) {
    console.log("Product in Review", product?._id)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)
    const [uploadedImages, setUploadedImages] = useState()
    const [limit, setLimit] = useState(3)
    const user = useSelector((store) => store.user)

    console.log("User", user)
    const [reviews, setReviews] = useState()

    const [newReview, setNewReview] = useState({
        rating: 5,
        recommend: true,
    })

    const fetchReviews = () => {
        if (!product?._id) {
            console.log("No product ID for reviews")
            return
        }
        axiosApiInstance
            .get(`/product/get-reviews/${product?._id}?limit=${limit}`)
            .then((response) => {
                if (response.data.flag == 1) {
                    setReviews(response.data.reviews)
                    console.log("Review tota", response.data.reviews)
                } else {
                    toast.error(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        if (product?._id) {
            fetchReviews()
        }
    }, [product?._id, limit])

    const handleImageUpload = (e) => {
        // const images = e.target.images.files;
        // for (let image of images) {
        //     setUploadedImages([image])
        // }
    }

    const handleSubmitReview = (e) => {
        e.preventDefault()
        // const formData = new FormData();
        // formData.append("name", e.target.name.value);
        // formData.append("email", e.target.email.value);
        // formData.append("rating", newReview.rating);
        // formData.append("title", e.target.title.value);
        // formData.append("comment", e.target.comment.value);
        // formData.append("recommend", newReview.recommend);
        // formData.append("user_id", user?.data?._id);
        // console.log("User_id", formData.get("user_id"));
        // formData.append("images", uploadedImages);

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            rating: newReview.rating,
            title: e.target.title.value,
            comment: e.target.comment.value,
            recommend: newReview.recommend,
            user_id: user?.data?._id,
        }

        if (user?.data != null) {
            axiosApiInstance
                .post(`/product/submit-review/${product._id}`, data)
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        console.log(response.data.newProduct)
                        setReviews(response.data.newProduct.review)
                        console.log("SetReview", reviews)
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        console.log("SetReview", reviews)

        setShowReviewForm(false)
    }
    const renderStars = (rating, interactive = false, onRatingChange = null, size = "text-lg") => {
        const currentRating = interactive ? hoverRating || rating : rating

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`${star <= currentRating ? "text-yellow-400" : "text-gray-300"
                            } ${interactive ? "cursor-pointer hover:scale-110 transition-all duration-200" : ""} ${size}`}
                        onClick={interactive ? () => onRatingChange(star) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                ))}
            </div>
        )
    }

    const getRatingText = (rating) => {
        const texts = {
            1: "Poor",
            2: "Fair",
            3: "Good",
            4: "Very Good",
            5: "Excellent",
        }
        return texts[rating] || ""
    }

    const getRatingEmoji = (rating) => {
        console.log("Hover Rating",rating)
        if (Number(rating) <= 2) return <BiFrown className="text-red-500 text-xl" />
        if (Number(rating) <= 3) return <BiMeh className="text-yellow-500 text-xl" />
        return <BiSmile className="text-green-500 text-xl" />
    }

    const averageRating = reviews?.reduce((acc, review) => acc + review.rating, 0) / reviews?.length
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews?.filter((review) => review.rating === rating).length,
        percentage: (reviews?.filter((review) => review.rating === rating).length / reviews?.length) * 100,
    }))

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 bg-background text-foreground mt-6 rounded-2xl">
            {/* Header Section */}
            <div className="mb-8 text-center">
                {/* Headings refined: responsive sizes, tighter tracking */}
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Customer Reviews</h2>
                {/* Neutralized subtext using muted-foreground */}
                <p className="text-muted-foreground text-base md:text-lg mt-2">
                    Share your experience and help others make informed decisions
                </p>
            </div>

            {/* Review Summary */}
            {/* Card surface with tokens, subtle shadow and border */}
            <div className="bg-card text-card-foreground rounded-2xl border border-[#e2e2e2] p-6 md:p-8 mb-8 shadow-md">
                {reviews?.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Overall Rating */}
                        <div className="text-center">
                            {/* Responsive type scale */}
                            <div className="text-5xl md:text-6xl font-bold mb-3">{averageRating.toFixed(1)}</div>
                            <div className="mb-3">{renderStars(Math.round(averageRating), false, null, "text-2xl")}</div>
                            <p className="text-muted-foreground text-base">Based on {reviews?.length} reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-3">
                            {ratingDistribution?.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-4">
                                    <span className="text-sm font-medium w-8">{rating}</span>
                                    {/* Keep star as accent; surrounding UI stays neutral */}
                                    <FaStar className="text-yellow-500 text-sm" />
                                    <div className="flex-1 bg-muted rounded-full h-3 border border-[#e2e2e2]">
                                        {/* Progress bar uses black as primary */}
                                        <div
                                            className="bg-black h-3 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Write Review Button */}
                {user.data != null && (
                    <div className="mt-8 text-center">
                        {/* Primary button uses black, strong focus and hover */}
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="inline-flex items-center justify-center bg-black text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-black/90 transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                        >
                            ✍️ Write Your Review
                        </button>
                    </div>
                )}
            </div>

            {/* Enhanced Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn custom-scrollbar">
                    {/* Modal uses card tokens, crisp border and deep shadow */}
                    <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                        <div className="flex justify-between items-center mb-6 md:mb-8">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold">Share Your Experience</h3>
                                <p className="text-muted-foreground mt-1">Your feedback helps others make better decisions</p>
                            </div>
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                            >
                                <HiOutlineX className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-6 md:space-y-8">
                            {/* Personal Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Your Name *</label>
                                    {/* Inputs use tokens and black focus ring */}
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-1 focus:ring-black/80 focus:border-black outline-none transition-all"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-1 focus:ring-black/80 focus:border-black outline-none transition-all"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Rating Section */}
                            {/* Neutral surface with border; removed gradients */}
                            <div className="bg-muted p-6 rounded-xl border border-border">
                                <label className="block text-sm font-semibold mb-4">Overall Rating *</label>
                                <div className="flex items-center gap-4 mb-3 max-md:flex-col">
                                    {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }), "text-3xl")}
                                    <div className="flex items-center gap-2">
                                        {getRatingEmoji(newReview.rating)}
                                        <span className="text-lg font-medium">{getRatingText(hoverRating || newReview.rating)}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">Click on the stars to rate your experience</p>
                            </div>

                            {/* Review Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Review Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-1 focus:ring-black/80 focus:border-black outline-none transition-all"
                                    placeholder="Summarize your experience in a few words"
                                    required
                                />
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Your Review *</label>
                                <textarea
                                    name="comment"
                                    rows={5}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-1 focus:ring-black/80 focus:border-black outline-none transition-all resize-none"
                                    placeholder="Share details about your experience. What did you like or dislike? How was the quality, delivery, customer service, etc.?"
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-muted-foreground">Minimum 50 characters</p>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-semibold mb-3">Add Photos (Optional)</label>
                                {/* Dashed dropzone styled with tokens */}
                                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-black transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        name="images"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <HiOutlinePhotograph className="text-4xl text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">Click to upload photos or drag and drop</p>
                                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB each</p>
                                    </label>
                                </div>
                            </div>

                            {/* Recommendation */}
                            {/* Recommendation pills use black as active state */}
                            <div className="bg-muted p-6 rounded-xl border border-border">
                                <label className="block text-sm font-semibold mb-4">Would you recommend this product?</label>
                                <div className="flex gap-4 max-md:flex-col">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recommend"
                                            checked={newReview.recommend === true}
                                            onChange={() => setNewReview({ ...newReview, recommend: true })}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${newReview.recommend === true
                                                ? "border-black bg-black text-white"
                                                : "border-border bg-background"
                                                }`}
                                        >
                                            <FaHeart className="text-sm" />
                                            <span className="font-medium">Yes, I recommend</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recommend"
                                            checked={newReview.recommend === false}
                                            onChange={() => setNewReview({ ...newReview, recommend: false })}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${newReview.recommend === false
                                                ? "border-black bg-black text-white"
                                                : "border-border bg-background"
                                                }`}
                                        >
                                            <span className="font-medium">No, I don't recommend</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-border">
                                {/* Primary submit is black, accessible focus */}
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-black/90 transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                                >
                                    🚀 Submit Review
                                </button>
                                {/* Secondary cancel: muted surface */}
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="flex-1 bg-muted text-foreground py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-muted/80 transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">All Reviews</h3>

                {reviews?.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            key={index}
                            // Card styling with tokens, hover elevation
                            className="bg-card text-card-foreground rounded-2xl border border-[#e2e2e2] p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    {/* Avatar circle uses black primary */}
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                                        <FaUser className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{review.user.name}</h4>
                                            {/* Verified badge neutral, subtle border */}
                                            {review.verified && (
                                                <span className="bg-black/5 text-foreground text-xs px-2 py-1 rounded-full font-medium border border-border">
                                                    ✓ Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-muted-foreground flex items-center gap-1 max-md:hidden">
                                                <FaCalendarAlt className="text-xs" />
                                                {review.createdAt.split("T")[0]}
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1 md:hidden mt-2">
                                            <FaCalendarAlt className="text-xs" />
                                            {review.createdAt.split("T")[0]}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h5 className="font-semibold mb-2">{review.title}</h5>
                            {/* Improved readability via relaxed leading and muted body text */}
                            <p className="text-muted-foreground leading-relaxed mb-4">{review.comment}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-[#e2e2e2]">
                                <div className="flex items-center gap-4">
                                    {/* Action buttons: subtle default, black on hover */}
                                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <FaThumbsUp className="text-sm" />
                                        <span className="text-sm">Helpful ({review.helpful})</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <FaThumbsDown className="text-sm" />
                                        <span className="text-sm">Not Helpful ({review.notHelpful})</span>
                                    </button>
                                </div>

                                <span className="text-sm text-muted-foreground max-md:hidden">Was this review helpful?</span>
                            </div>
                            <span className="text-sm text-muted-foreground md:hidden mt-2">Was this review helpful?</span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center">No reviews found.</p>
                )}
            </div>

            {/* Load More Button */}
            {reviews?.length >= 3 && (
                <div className="text-center mt-8">
                    {/* Primary black for load more */}
                    <button
                        className="bg-black text-white px-6 md:px-8 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black cursor-pointer"
                        onClick={() => setLimit(limit + 3)}
                    >
                        Load More Reviews
                    </button>
                </div>
            )}

            {/* animations unchanged */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-slideUp { animation: slideUp 0.3s ease-out; }
            `}</style>
        </div>
    )
}
