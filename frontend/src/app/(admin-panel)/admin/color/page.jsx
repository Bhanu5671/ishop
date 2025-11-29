import React from 'react';
import Link from 'next/link';
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrashRestore } from "react-icons/fa";
import { getColorData } from '@/app/library/api-call';
import ToggleStatus from '@/app/component/admin/ToggleStatus';
import DeleteBtn from '@/app/component/admin/DeleteBtn';

export default async function ColorPage() {
  const colorsJSON = await getColorData();
  const colorData = colorsJSON ? colorsJSON.colors : [];

  return (
    <>
      <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <section className="w-full max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-black tracking-wide">Colors</h1>
            <p className="text-gray-600 mt-1 text-lg">Add a new color to organize your inventory</p>
          </header>

          <div className="flex gap-4 mb-6 justify-end">
            <Link href="/admin/color/add" passHref>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-black px-5 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              >
                <IoMdAdd style={{ fill: "white", fontSize: "18px" }} />
                <span>Add Color</span>
              </button>
            </Link>

            <Link href="/admin/color/trash" passHref>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-red-700 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              >
                <FaTrashRestore />
                <span>Trash</span>
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
            <table className="w-full min-w-[640px] text-md">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="p-3 font-medium">Id</th>
                  <th className="p-3 font-medium">Color Name</th>
                  <th className="p-3 font-medium">Color Slug</th>
                  <th className="p-3 font-medium">Color Code</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colorData.map((color, index) => (
                  <tr
                    key={color._id}
                    className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 capitalize whitespace-nowrap">{color.name}</td>
                    <td className="p-3 whitespace-nowrap">{color.slug}</td>
                    <td className="p-3 whitespace-nowrap font-mono">{color.hexacode}</td>
                    <td className="p-3 whitespace-nowrap">
                      <ToggleStatus status={color.status} id={color._id} toggleURL={"/color/change_status"} />
                    </td>
                    <td className="p-3 flex gap-3 items-center">
                      <Link href={`/admin/color/edit/${color._id}`} passHref>
                        <button
                          type="button"
                          className="cursor-pointer text-amber-500 hover:text-amber-600 transition"
                          title="Rename"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <DeleteBtn DeleteURL={`/color/move-to-trash/${color._id}`} flag={1} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
