"use client"
import React, { useEffect } from 'react'
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from 'next/link';
import { axiosApiInstance } from '@/app/library/helper';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from '@/redux/features/adminSlice';

export default function Header() {
  const admin = useSelector((store) => store.admin.data);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const lsAdmin = localStorage.getItem("admin");
    const lsLoginAt = localStorage.getItem("loginAt");

    if (lsAdmin) {
      dispatch(setAdmin({
        data: JSON.parse(lsAdmin),
        loginAt: lsLoginAt
      }));
    }
  }, [dispatch]);

  const logoutHandler = () => {
    axiosApiInstance.post("/login/logout")
      .then(response => {
        if (response.data.flag === 1) {
          toast.success(response.data.message);
          router.push("/admin-auth/login");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(error => {
        toast.error(error.toString());
      });
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div>
        <span className="text-xl font-semibold text-black max-md:pl-10">Hi, {admin?.first_name || 'Admin'}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="border border-gray-300 p-2 rounded-md flex items-center cursor-pointer hover:border-black transition">
          <IoMdNotificationsOutline className="text-2xl text-gray-600" />
        </div>

        <button
          onClick={logoutHandler}
          className="px-4 py-2 bg-black text-white rounded-md font-semibold shadow-md hover:shadow-lg transition cursor-pointer"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
