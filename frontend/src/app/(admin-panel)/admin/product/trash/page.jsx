import React from 'react'
import Link from 'next/link'
import { FaBackward } from "react-icons/fa"
import { getTrashProductData } from '@/app/library/api-call'
import DeleteBtn from '@/app/component/admin/DeleteBtn'
import ToggleStatus from '@/app/component/admin/ToggleStatus'
import UndoBtn from '@/app/component/admin/UndoBtn'
import MultipleImages from '@/app/component/website/MultipleImages'
import ViewDetailes from '@/app/component/website/ViewDetailes'

export default async function TrashPage() {
  const trashJSON = await getTrashProductData()
  const trashProductData = trashJSON ? trashJSON.trashProductData : []

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-black tracking-wide">Product / Trash</h1>
          <p className="text-gray-600 mt-1 text-lg">Recover your Deleted Product</p>
        </header>

        <div className="flex justify-end mb-6">
          <Link href="/admin/product" passHref>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-md bg-black px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              title="Back to Product"
            >
              <FaBackward style={{ fill: "white", fontSize: "18px" }} />
              <span>Back to Product</span>
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
          {trashProductData.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-lg">
              No deleted products found.
            </div>
          ) : (
            <table className="w-full min-w-[800px] text-md table-fixed">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="p-3 font-medium w-10">Id</th>
                  <th className="p-3 font-medium w-48 max-w-[180px]">Product Name</th>
                  <th className="p-3 font-medium w-48 max-w-[180px]">Product Slug</th>
                  <th className="p-3 font-medium w-28">Product Image</th>
                  <th className="p-3 font-medium w-40">Product Category</th>
                  <th className="p-3 font-medium w-48">Product Colors</th>
                  <th className="p-3 font-medium w-24">Status</th>
                  <th className="p-3 font-medium w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trashProductData.map((trash, index) => (
                  <tr
                    key={trash._id}
                    className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 capitalize max-w-[180px] break-words">{trash.name}</td>
                    <td className="p-3 max-w-[180px] break-words">{trash.slug}</td>
                    <td className="p-3">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${trash.main_image}`}
                        alt={trash.name}
                        className="w-24 h-auto rounded-md object-cover shadow-sm"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap">{trash.category_id?.name || '-'}</td>
                    <td className="p-3 max-h-24 overflow-auto">
                      <ul className="list-disc list-inside space-y-1">
                        {trash.colors.map(color => (
                          <li key={color._id} className="capitalize">{color.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <ToggleStatus status={trash.status} id={trash._id} toggleURL={"/product/change_status"} />
                    </td>
                    <td className="p-3 flex flex-wrap gap-3 justify-start items-center">
                      <MultipleImages
                        deleteURL={`/product/delete-images/${trash._id}`}
                        other_images={trash.other_images}
                        apiURL={`/product/upload-other-images/${trash._id}`}
                      />
                      <ViewDetailes data={trash.description} />
                      <UndoBtn UndoURL={`/product/undo/${trash._id}`} />
                      <DeleteBtn DeleteURL={`/product/delete/${trash._id}`} flag={0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  )
}
