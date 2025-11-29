import React from 'react'
import Link from 'next/link'
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrashRestore } from "react-icons/fa";
import { getProductData } from '@/app/library/api-call';
import ToggleStatus from '@/app/component/admin/ToggleStatus';
import DeleteBtn from '@/app/component/admin/DeleteBtn';
import ViewDetailes from '@/app/component/website/ViewDetailes';
import MultipleImages from '@/app/component/website/MultipleImages';

export default async function ProductPage() {
  const productJSON = await getProductData();
  const productData = productJSON ? productJSON.products : [];

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="w-full max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-black tracking-wide">Product</h1>
          <p className="text-gray-600 mt-1 text-lg">Add a new product to organize your inventory</p>
        </header>

        <div className="flex gap-4 mb-6 justify-end">
          <Link href="/admin/product/add" passHref>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-black px-5 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              title="Add Product"
            >
              <IoMdAdd style={{ fill: "white", fontSize: "18px" }} />
              <span>Add Product</span>
            </button>
          </Link>

          <Link href="/admin/product/trash" passHref>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-red-700 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition cursor-pointer"
              title="Trash"
            >
              <FaTrashRestore />
              <span>Trash</span>
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
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
              {productData.map((prod, index) => (
                <tr
                  key={prod._id}
                  className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">{index + 1}</td>
                  <td className="p-3 capitalize max-w-[180px] break-words">{prod.name}</td>
                  <td className="p-3 max-w-[180px] break-words">{prod.slug}</td>
                  <td className="p-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/products/${prod.main_image}`}
                      alt={prod.name}
                      className="w-24 h-24 rounded-md object-contain shadow-sm"
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">{prod.category_id?.name || '-'}</td>
                  <td className="p-3">
                    <ul className="list-disc list-inside max-h-24 overflow-auto space-y-1">
                      {prod.colors.map((color) => (
                        <li key={color._id} className="capitalize">
                          {color.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <ToggleStatus status={prod.status} id={prod._id} toggleURL={"/product/change_status"} />
                  </td>
                  <td className="p-3 flex flex-wrap gap-3 justify-start items-center">
                    <MultipleImages
                      deleteURL={`/product/delete-images/${prod._id}`}
                      other_images={prod.other_images}
                      apiURL={`/product/upload-other-images/${prod._id}`}
                    />
                    <ViewDetailes data={prod.description} />
                    <Link href={`/admin/product/edit/${prod._id}`} passHref>
                      <button
                        type="button"
                        className="cursor-pointer text-amber-500 hover:text-amber-600 transition"
                        title="Rename"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    <DeleteBtn DeleteURL={`/product/move-to-trash/${prod._id}`} flag={1} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
