import React from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from "react-icons/fa"


export default function Footer() {
  return (
     <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Top tier: Brand | Follow | Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* Brand blurb */}
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[#C1C8CE]">iSHOP</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s.
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className=' text-[#22262A]'>Follow Us</h4>
            <p className="mt-3 text-sm text-slate-600">
              Lorem Ipsum is simply dummy text of the printing industry. Lorem Ipsum has been.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className=' text-[#22262A]'>Contact Us</h4>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>iShop: address @building 124</li>
              <li>Call us: +00 1234 567 89</li>
              <li>Email: support@whatever.com</li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Bottom tier: 6 link columns */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {["Information", "Service", "Extras", "My Account", "Useful Links", "Our Offers"].map((title) => (
            <nav key={title} aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
              <h4 id={title.replace(/\s+/g, "-").toLowerCase()} className="mb-3 font-semibold text-slate-900">
                {title}
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    Information
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </nav>
          ))}
        </div>

        {/* Payment icons aligned right */}
        <div className="mt-10 flex items-center justify-end gap-3 text-slate-500">
          <FaCcMastercard className="h-8 w-8" aria-label="Mastercard" />
          <FaCcVisa className="h-8 w-8" aria-label="Visa" />
          <FaCcPaypal className="h-8 w-8" aria-label="PayPal" />
          <FaCcAmex className="h-8 w-8" aria-label="American Express" />
        </div>
      </div>
    </footer>
  )
}
