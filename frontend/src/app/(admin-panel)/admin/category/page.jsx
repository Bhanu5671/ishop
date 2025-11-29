import Link from "next/link"
import { IoMdAdd } from "react-icons/io"
import { FaEdit, FaTrashRestore } from "react-icons/fa"
import { getCategoryData } from "@/app/library/api-call"
import DeleteBtn from "@/app/component/admin/DeleteBtn"
import ToggleStatus from "@/app/component/admin/ToggleStatus"

export default async function CategoryPage() {
  const categoryJSON = await getCategoryData()
  console.log("Category JSON:", categoryJSON)
  const categories = categoryJSON ? categoryJSON.categories : []

  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#e2e2e2]">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-black text-balance">Category</h1>
          <p className="text-sm md:text-base text-gray-600">Add a new product category to organize your inventory</p>
        </header>

        <div className="flex flex-wrap gap-3 mt-5 justify-end">
          <Link href="/admin/category/add">
            <button
              className="cursor-pointer text-white bg-black p-3 px-5 rounded-md flex gap-2 items-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              title="Add Category"
            >
              <IoMdAdd style={{ fill: "white", fontSize: "18px" }} />
              <span className="whitespace-nowrap">Add Category</span>
            </button>
          </Link>

          <Link href="/admin/category/trash">
            <button
              className="cursor-pointer bg-red-600 text-white p-3 px-5 flex gap-2 items-center rounded-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              title="Trash"
            >
              <FaTrashRestore />
              <span className="whitespace-nowrap">Trash</span>
            </button>
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-sm">
          <table className="min-w-full text-md">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-gray-600">Id</th>
                <th className="p-3 text-left text-gray-600">Category Name</th>
                <th className="p-3 text-left text-gray-600">Category Slug</th>
                <th className="p-3 text-left text-gray-600">Status</th>
                <th className="p-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryJSON != null &&
                categories.map((category, index) => (
                  <tr className="border-t border-[#e2e2e2] hover:bg-gray-50 transition" key={category._id}>
                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                    <td className="p-3 capitalize whitespace-nowrap">{category.name}</td>
                    <td className="p-3 whitespace-nowrap">{category.slug}</td>
                    <td className="p-3 whitespace-nowrap">
                      <ToggleStatus status={category.status} id={category._id} toggleURL={"/category/change_status"} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 items-center">
                        <Link href={`/admin/category/edit/${category._id}`}>
                          <button
                            className="cursor-pointer text-amber-500 hover:text-amber-600 transition"
                            title="Rename"
                          >
                            <FaEdit />
                          </button>
                        </Link>

                        {/* Delete button (logic unchanged) */}
                        <DeleteBtn DeleteURL={`/category/move-to-trash/${category._id}`} flag={1} />

                        {/* Placeholder link retained (logic unchanged) */}
                        <Link href="/admin/category/edit/example-category"></Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
