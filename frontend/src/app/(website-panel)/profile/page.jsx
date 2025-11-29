"use client"

import { axiosApiInstance } from "@/app/library/helper"
import { useState } from "react"
import { FiUser, FiMail, FiLock, FiEdit3, FiSave, FiX } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { saveUserToLocalStorage } from "@/redux/features/userSlice"
import { toast } from "react-toastify"

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState("profile")
    const [editingProfile, setEditingProfile] = useState(false)
    const user = useSelector((store) => store.user)
    const dispatch = useDispatch()

    const [userProfile, setUserProfile] = useState({
        name: user?.data?.name,
        email: user?.data?.email,
    })
    const data = {
        name: userProfile.name,
        email: userProfile.email,
        user_id: user?.data?._id,
    }
    const handleSaveProfile = () => {
        setEditingProfile(false)
        if (user?.data != null) {
            axiosApiInstance
                .post("/user/update-profile", data)
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        const lsCart = localStorage.getItem("user")
                        const finalLsCart = lsCart ? JSON.parse(lsCart) : []
                        finalLsCart.user.name = response.data.new_User.name
                        finalLsCart.user.email = response.data.new_User.email
                        localStorage.setItem("user", JSON.stringify(finalLsCart))
                        dispatch(saveUserToLocalStorage())
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        // Save profile logic here
    }
    const submitPasswordHandler = (e) => {
        e.preventDefault()
        const data = {
            old_password: e.target.old_password.value,
            new_password: e.target.new_password.value,
            confirm_new_password: e.target.confirm_new_password.value,
            user_id: user?.data?._id,
        }
        if (user.data != null) {
            axiosApiInstance
                .post("/user/change-password", data)
                .then((response) => {
                    if (response.data.flag == 1) {
                        toast.success(response.data.message)
                        const lsUser = localStorage.getItem("user")
                        const finalLsUser = lsUser ? JSON.parse(lsUser) : []
                        finalLsUser.user.password = response.data.new_User.password
                        localStorage.setItem("user", JSON.stringify(finalLsUser))
                        dispatch(saveUserToLocalStorage())
                        e.target.reset()
                    } else {
                        toast.error(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8 md:mb-10">
                    <div className="bg-card rounded-xl border border-[#e2e2e2] shadow-md p-2 flex gap-2">
                        {[
                            { id: "profile", label: "Profile", icon: FiUser },
                            { id: "security", label: "Security", icon: FiLock },
                        ].map((item) => {
                            const Icon = item.icon
                            const active = activeSection === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer border ${active
                                        ? "bg-foreground text-background border-transparent shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
                                        }`}
                                    aria-current={active ? "page" : undefined}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content Sections */}
                {activeSection === "profile" && (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground text-pretty">Profile Information</h2>
                            {!editingProfile ? (
                                <button
                                    onClick={() => setEditingProfile(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium cursor-pointer shadow-sm border border-transparent"
                                >
                                    <FiEdit3 className="w-5 h-5" />
                                    <span className="hidden sm:inline">Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium cursor-pointer shadow-sm border border-transparent"
                                    >
                                        <FiSave className="w-5 h-5" />
                                        <span className="hidden sm:inline">Save</span>
                                    </button>
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium cursor-pointer border border-[#e2e2e2]"
                                    >
                                        <FiX className="w-5 h-5" />
                                        <span className="hidden sm:inline">Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-card rounded-xl border border-[#e2e2e2] shadow-md p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2.5">
                                        <FiUser className="inline w-5 h-5 mr-2 align-text-top text-muted-foreground" />
                                        Full Name
                                    </label>
                                    {editingProfile ? (
                                        <input
                                            type="text"
                                            defaultValue={user.data.name}
                                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-background border border-[#e2e2e2] rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-transparent text-base"
                                        />
                                    ) : (
                                        <p className="text-foreground text-lg md:text-xl font-medium bg-muted px-3 py-2.5 rounded-lg">
                                            {user?.data?.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2.5">
                                        <FiMail className="inline w-5 h-5 mr-2 align-text-top text-muted-foreground" />
                                        Email Address
                                    </label>
                                    {editingProfile ? (
                                        <input
                                            type="email"
                                            defaultValue={user.data.email}
                                            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-background border border-[#e2e2e2] rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-transparent text-base"
                                        />
                                    ) : (
                                        <p className="text-foreground text-lg md:text-xl font-medium bg-muted px-3 py-2.5 rounded-lg">
                                            {user?.data?.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeSection === "security" && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8 text-pretty">
                            Security Settings
                        </h2>

                        <div className="bg-card rounded-xl border border-[#e2e2e2] shadow-md p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center border border-[#e2e2e2]">
                                    <FiLock className="w-7 h-7 md:w-8 md:h-8 text-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-foreground">Change Password</h3>
                                    <p className="text-muted-foreground text-sm md:text-base">
                                        Update your password to keep your account secure
                                    </p>
                                </div>
                            </div>
                            <form className="space-y-5 md:space-y-6" onSubmit={submitPasswordHandler}>
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2.5">Current Password</label>
                                    <input
                                        type="password"
                                        name="old_password"
                                        className="w-full px-3 py-2.5 bg-background border border-[#e2e2e2] rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-transparent text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2.5">New Password</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        className="w-full px-3 py-2.5 bg-background border border-[#e2e2e2] rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-transparent text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2.5">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm_new_password"
                                        className="w-full px-3 py-2.5 bg-background border border-[#e2e2e2] rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-transparent text-base"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 md:px-8 py-2.5 md:py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium cursor-pointer shadow-sm border border-transparent"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
