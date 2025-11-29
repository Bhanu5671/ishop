import { getadminLogs } from '@/app/library/api-call';
import React from 'react';

export default async function AdminLogs() {
    const AdminLogsJSON = await getadminLogs();
    const AdminLogsData = AdminLogsJSON ? AdminLogsJSON.AdminLogsData : [];

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <section className="w-full max-w-full mx-auto bg-white rounded-lg border border-[#e2e2e2] shadow-xl p-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold text-black tracking-wide">Admin Logs</h1>
                    <p className="text-gray-600 mt-1 text-lg">Changes done by Admins.</p>
                </header>

                <div className="overflow-x-auto rounded-lg border border-[#e2e2e2] shadow-md">
                    {AdminLogsData.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 text-lg">
                            No admin logs found.
                        </div>
                    ) : (
                        <table className="w-full min-w-[640px] text-md table-auto">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600">
                                    <th className="p-3 font-medium">S.No.</th>
                                    <th className="p-3 font-medium">Admin Name</th>
                                    <th className="p-3 font-medium">Operation</th>
                                    <th className="p-3 font-medium">Model</th>
                                    <th className="p-3 font-medium max-w-[220px]">Changes on</th>
                                    <th className="p-3 font-medium">Time</th>
                                    <th className="p-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AdminLogsData.map((log, index) => (
                                    <tr
                                        key={log._id}
                                        className="border-t border-[#e2e2e2] hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-3 whitespace-nowrap">{index + 1}</td>
                                        <td className="p-3 capitalize whitespace-nowrap">
                                            {log.adminId.first_name} {log.adminId.last_name}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{log.operation}</td>
                                        <td className="p-3 whitespace-nowrap">{log.model}</td>
                                        <td className="p-3 max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap" title={log.categoryId?.name || log.productId?.name || log.colorId?.name || '-'}>
                                            {log.categoryId?.name || log.productId?.name || log.colorId?.name || '-'}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </main>
    );
}
