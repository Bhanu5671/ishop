import { FaPhoneAlt, FaExchangeAlt, FaTimesCircle, FaHistory, FaTasks, FaBell, FaUserCircle, FaSignOutAlt, FaRegCheckCircle } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center">

            {/* Profile & Status Panel */}
            <div className="relative w-full flex flex-col items-center">
                <div className="absolute top-3 right-4 flex items-center gap-2">
                    <FaBell className="text-2xl text-gray-500" />
                    <span className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-bold flex items-center shadow">
                        Online
                        <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />
                    </span>
                    <button className="bg-white border border-gray-300 p-2 rounded-full text-gray-600 hover:bg-gray-100 shadow">
                        <FaSignOutAlt />
                    </button>
                </div>
                <div className="w-4/5 mt-9 bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center relative z-10">
                    <div className="bg-gradient-to-br from-green-300 to-blue-300 rounded-full p-4 mb-3 shadow-lg">
                        <FaUserCircle className="text-5xl text-gray-700" />
                    </div>
                    <div className="text-xl font-extrabold text-gray-800 tracking-wide">Bhanu</div>
                    <div className="text-sm text-gray-600 mb-2">bhanu@saleassist.ai</div>
                    <button className="absolute top-3 right-3 bg-blue-100 p-2 rounded-full hover:bg-blue-200">
                        <MdModeEdit className="text-lg text-blue-500" />
                    </button>
                </div>
            </div>

            {/* Action Cards Grid */}
            <div className="-mt-8 w-11/12 grid grid-cols-2 gap-6 z-20">
                <Card icon={<FaPhoneAlt />} label="Active Calls" color="bg-blue-200" iconColor="text-blue-800" />
                <Card icon={<FaExchangeAlt />} label="Transfer Logs" color="bg-teal-200" iconColor="text-teal-800" />
                <Card icon={<FaTimesCircle />} label="Missed Calls" color="bg-red-200" iconColor="text-red-700" />
                <Card icon={<FaHistory />} label="History" color="bg-purple-200" iconColor="text-purple-700" />
                <Card icon={<FaTasks />} label="To-Do Tasks" color="bg-yellow-100" iconColor="text-yellow-700" />
                <Card icon={<FaRegCheckCircle />} label="Invitations" color="bg-gray-200" iconColor="text-gray-700" />
            </div>

            {/* Floating Quick-Add Button */}
            <button className="fixed bottom-24 right-7 bg-gradient-to-r from-blue-500 to-green-400 text-white p-5 rounded-full shadow-xl transition hover:scale-105 z-50">
                <FaTasks className="text-3xl" />
            </button>

            {/* Bottom Navigation Sheet */}
            <div className="fixed bottom-0 w-full bg-white shadow-lg rounded-t-3xl flex justify-around items-center py-4 px-1 transition z-40">
                <NavBtn icon={<FaPhoneAlt />} label="Calls" active />
                <NavBtn icon={<FaUserCircle />} label="Profile" />
                <NavBtn icon={<FaHistory />} label="History" />
                <NavBtn icon={<FaBell />} label="Alerts" />
            </div>
        </div>
    );
}

function Card({ icon, label, color, iconColor }) {
    return (
        <div className={`rounded-2xl flex flex-col items-center justify-center p-5 shadow-lg hover:scale-105 transition cursor-pointer gap-2 ${color}`}>
            <div className={`text-4xl mb-1 ${iconColor}`}>{icon}</div>
            <span className="font-bold text-lg text-gray-700">{label}</span>
        </div>
    );
}

function NavBtn({ icon, label, active }) {
    return (
        <button className={`flex flex-col items-center justify-center px-2 ${active ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
            <div className="text-2xl">{icon}</div>
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
}
