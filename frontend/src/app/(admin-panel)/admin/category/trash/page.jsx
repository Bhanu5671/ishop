import Link from "next/link";
import { FaBackward } from "react-icons/fa";
import { getTrashData } from "@/app/library/api-call";
import DeleteBtn from "@/app/component/admin/DeleteBtn";
import ToggleStatus from "@/app/component/admin/ToggleStatus";
import UndoBtn from "@/app/component/admin/UndoBtn";

export default async function TrashPage() {
  const TrashJSON = await getTrashData();
  const trash = TrashJSON ? TrashJSON.trashData : [];

  return (
    <>
      <main className="w-full min-h-screen bg-white">
        <section className="w-full mx-auto p-4 bg-white rounded-md shadow-lg border border-[#e2e2e2]">
          <header className="border-b border-[#e2e2e2] pb-4 mb-6">
            <h1 className="text-3xl font-semibold text-black text-balance">Category / Trash</h1>
            <p className="text-gray-500 mt-1">Recover your Deleted Category</p>
          </header>

          <div className="flex justify-end mb-6">
            <Link href="/admin/category" passHref>
              <button
                className="inline-flex items-center gap-2 rounded-md bg-black text-white px-5 py-3 cursor-pointer shadow-md hover:shadow-xl active:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                type="button"
              >
                <FaBackward style={{ fill: "white", fontSize: "18px" }} />
                <span className="font-semibold">Back to Category</span>
              </button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="p-3 text-sm font-medium">Id</th>
                  <th className="p-3 text-sm font-medium">Category Name</th>
                  <th className="p-3 text-sm font-medium">Category Slug</th>
                  <th className="p-3 text-sm font-medium">Status</th>
                  <th className="p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {TrashJSON &&
                  trash.map((item, index) => (
                    <tr key={item._id} className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors">
                      <td className="p-3 align-middle">{index + 1}</td>
                      <td className="p-3 align-middle capitalize">{item.name}</td>
                      <td className="p-3 align-middle">{item.slug}</td>
                      <td className="p-3 align-middle">
                        <ToggleStatus status={item.status} id={item._id} toggleURL={"/category/change_status"} />
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-3">
                          <UndoBtn UndoURL={`/category/undo/${item._id}`} />
                          <DeleteBtn DeleteURL={`/category/delete/${item._id}`} flag={0} />
                        </div>
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
