import React from 'react'
import Link from 'next/link';
import { FaBackward } from "react-icons/fa";
import DeleteBtn from '@/app/component/admin/DeleteBtn';
import ToggleStatus from '@/app/component/admin/ToggleStatus';
import UndoBtn from '@/app/component/admin/UndoBtn';
import { getColorTrash } from '@/app/library/api-call';

export default async function TrashPage() {
  const TrashJSON = await getColorTrash();
  const trash = TrashJSON ? TrashJSON.trashColors : [];

  return (
    <>
      <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <section className="w-full max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold text-black tracking-wide">Color / Trash</h1>
            <p className="text-gray-600 mt-1 text-lg">Recover your Deleted Color</p>
          </header>

          <div className="flex justify-end mb-6">
            <Link href="/admin/color" passHref>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              >
                <FaBackward style={{ fill: "white", fontSize: "18px" }} />
                <span>Back to Colors</span>
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
            {trash.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-lg">
                No deleted colors found.
              </div>
            ) : (
              <table className="w-full min-w-[640px] text-md">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="p-3 font-medium">Id</th>
                    <th className="p-3 font-medium">Category Name</th>
                    <th className="p-3 font-medium">Category Slug</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trash.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 whitespace-nowrap">{index + 1}</td>
                      <td className="p-3 capitalize whitespace-nowrap">{item.name}</td>
                      <td className="p-3 whitespace-nowrap">{item.slug}</td>
                      <td className="p-3 whitespace-nowrap">
                        <ToggleStatus status={item.status} id={item._id} toggleURL={"/color/change_status"} />
                      </td>
                      <td className="p-3 flex gap-3 items-center">
                        <UndoBtn UndoURL={`/color/undo/${item._id}`} />
                        <DeleteBtn DeleteURL={`/color/delete/${item._id}`} flag={0} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
