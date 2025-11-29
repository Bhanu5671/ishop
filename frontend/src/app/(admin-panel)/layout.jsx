import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React from "react";
import Sidemenu from "../component/admin/Sidemenu";
import Header from "../component/admin/Header";
import { ToastContainer } from 'react-toastify';
import StoreProvider from "../component/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel",
  description: "Admin Panel for managing the website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ToastContainer />
          <div className="grid grid-cols-5 ">
            <Sidemenu className="max-md:hidden" />
            <div className="md:col-span-4 bg-gray-100 col-span-5">
              <Header />
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
