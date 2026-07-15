"use client"
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import Link from "next/link";
import EditAdminProfileDialog from "./EditAdminProfile";
import ChangePasswordDialog from "./ChangePassword";
import CreateAdminModal from "../admin/CreateAdmin";
import { adminAuthStore } from "@/store/adminAuthStore";

export default function AdminActionsPanel() {
  const {adminDatas} = adminAuthStore()
  const items = [
   
    {
      label: "View Events",
      icon: <FaCalendarAlt />,
      link: "/dashboard/events",
    },
    {
      label: "View Employees",
      icon: <FaUsers />,
      link: "/dashboard/employees",
    },
    {
      label: "View Enquiries",
      icon: <FaEnvelopeOpenText />,
      link: "/dashboard/enquiry",
    },
  ];

  return (
    <motion.div
      className=" rounded-xl  p-6 grid grid-cols-1 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        {adminDatas?.role !=="Manage Admin" && <CreateAdminModal/> } 
        <EditAdminProfileDialog/>
        <ChangePasswordDialog/>
      {items.map((item, index) => {
        const content = (
          <div className="flex items-center bg-white gap-2 p-1 rounded-lg border border-primary/20 hover:shadow-md transition">
            <div className="bg-primary/10 text-primary p-3 rounded-full text-lg">
              {item.icon}
            </div>
            <h1 className="text-gray-800 font-medium text-sm">{item.label}</h1>
          </div>
        );

        return item.link ? (
          <Link href={item.link} key={index}>
            {content}
          </Link>
        ) : (
          <div key={index}>{content}</div>
        );
      })}
    </motion.div>
  );
}
