import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import Link from "next/link";
import EditAdminProfileDialog from "./EditAdminProfile";
import ChangePasswordDialog from "./ChangePassword";

export default function AdminActionsPanel() {
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
      link: "/dashboard/enquiries",
    },
  ];

  return (
    <motion.div
      className=" rounded-xl  p-6 grid grid-cols-1 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <EditAdminProfileDialog/>
        <ChangePasswordDialog/>
      {items.map((item, index) => {
        const content = (
          <div className="flex items-center bg-white gap-2 p-1 rounded-lg border border-gray-100  hover:shadow-md transition">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full text-lg">
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
