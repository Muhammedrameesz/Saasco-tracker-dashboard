"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaRegCalendarCheck,
  FaRegCalendar,
  FaRegCalendarAlt,
  FaUserFriends,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import Image from "next/image";

const stats = [
  {
    id: 1,
    title: "Past Events",
    value: 120,
    icon: FaRegCalendarCheck,
    gradient: "from-blue-300 to-blue-50",
    image:
      "https://img.freepik.com/free-vector/infographic_53876-25855.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740",
  },
  {
    id: 2,
    title: "Current Events",
    value: 54,
    icon: FaRegCalendar,
    gradient: "from-green-300 to-green-50",
    image:
      "https://img.freepik.com/premium-photo/market-chart-business-glowing-stock-graph-investment-financial-data-profit-growth-money-diagram-background-with-diagram-exchange-information-3d-rendering_79161-1797.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
  },
  {
    id: 3,
    title: "Future Events",
    value: 47,
    icon: FaRegCalendarAlt,
    gradient: "from-purple-300 to-purple-50",
    image:
      "https://img.freepik.com/free-vector/abstract-red-light-lines-pipe-speed-zoom-black-background-technology_1142-8971.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
  },
  {
    id: 4,
    title: "Total Delivered",
    value: 240,
    icon: FaEnvelopeOpenText,
    gradient: "from-yellow-300 to-yellow-50",
    image:
      "https://img.freepik.com/premium-psd/digital-tablet-screen-mockup-psd-smart-tech_53876-676311.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
  },
  {
    id: 5,
    title: "Total Employees",
    value: 32,
    icon: FaUserFriends,
    gradient: "from-red-300 to-red-50",
    image:
      "https://img.freepik.com/free-vector/hand-drawn-flat-design-stock-market-concept_23-2149167960.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740",
  },
  {
    id: 6,
    title: "Pending Enquiries",
    value: 15,
    icon: FaEnvelopeOpenText,
    gradient: "from-indigo-300 to-indigo-50",
    image:
      "https://img.freepik.com/premium-photo/chart-with-uptrend-line-graph-bar-chart-diagram-bull-market-dark-blue-background_97770-3.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
  },
];

function MainDashboard() {
  return (
     <div className="p-6 space-y-6">
     
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              className={`
                bg-gradient-to-br ${s.gradient} text-gray-950 rounded-2xl shadow-lg
                flex flex-col overflow-hidden
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s.id * 0.01, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Top Image */}
              <div className="w-full h-32 relative">
                <Image
                  src={s.image}
                  alt={s.title}
                  layout="fill"
                  objectFit="cover"
                  className="object-contain"
                />
              </div>

              <div className="p-6 flex flex-col items-center">
                <Icon className="w-10 h-10 mb-2 opacity-90" />
                <h3 className="text-lg font-semibold mb-1 ">{s.title}</h3>
                <h4 className="text-4xl font-bold drop-shadow  text-orange-600">{s.value}</h4>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default MainDashboard;
