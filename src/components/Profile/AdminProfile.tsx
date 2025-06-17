"use client";

import { adminAuthStore } from "@/store/adminAuthStore";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaUserShield,
  FaEnvelope,
  FaPhoneAlt,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import AdminActionsPanel from "./AdminActionPannel";

export default function AdminProfile() {
  const { adminDatas } = adminAuthStore();

  return (
    <section>
      <section className="bg-white py-8 px-6 md:px-12 mt-7 border-b border-gray-200 rounded-xl shadow-sm  overflow-hidden relative mx-5">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-[#cb301b] rounded-full opacity-20"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-[#cb301b] text-white shadow-lg">
            <RiAdminFill className="text-2xl" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#cb301b] mb-2 tracking-tight">
              Welcome, {adminDatas.name || "Admin"}
            </h1>
            <p className="text-gray-600 text-base max-w-xl mx-auto md:mx-0">
              Manage your profile, view your details, and update information
              with ease.
            </p>
          </div>
        </div>
      </section>

      <motion.section
        className="max-w-7xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 md:p-12 border border-gray-100 col-span-3"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src="https://img.freepik.com/premium-vector/rich-concept-pictogram_1076610-8493.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740"
                alt="Admin Profile"
                width={150}
                height={150}
                className=" shadow-md"
              />
            </div>

            {/* Info */}
            <div className="w-full space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-700 flex items-center gap-3">
                <FaUserShield className="text-orange-500" />
                {adminDatas.name || "Admin Name"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                <InfoLine
                  icon={<FaEnvelope />}
                  label="Email"
                  value={adminDatas.email}
                />
                <InfoLine
                  icon={<FaPhoneAlt />}
                  label="Phone"
                  value={adminDatas.phone}
                />
                <InfoLine
                  icon={<FaUserTag />}
                  label="Role"
                  value={adminDatas.role}
                />
                <InfoLine
                  icon={<FaCalendarAlt />}
                  label="Joined On"
                  value={formatDate(adminDatas.create)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <AdminActionsPanel />
      </motion.section>
    </section>
  );
}

// Reusable Info Line
interface InfoLineProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const InfoLine = ({ icon, label, value }: InfoLineProps) => (
  <motion.div
    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-orange-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </motion.div>
);

// Format Date Function
const formatDate = (input?: string | Date): string => {
  if (!input) return "N/A";

  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
