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
import { useGetPendingEnquiries } from "@/customHooks/useGetPendingEnquiries";
import { useGetTotalEmployees } from "@/customHooks/useGetTotalEmployees";
import { useGetEventCounts } from "@/customHooks/useGetEventsCount";

function MainDashboard() {
  const { pendingCount } = useGetPendingEnquiries();
  const { totalCount } = useGetTotalEmployees();
  const { counts } = useGetEventCounts();

  const pastEvents = counts.past;
  const currentEvents = counts.current;
  const futureEvents = counts.upcoming;
  const deliverdEvents = counts.delivered;

  const stats = [
    {
      id: 1,
      title: "Current Events",
      value: currentEvents || 0,
      icon: FaRegCalendar,
      gradient: "from-green-100 to-green-50",
      image:
        "https://img.freepik.com/premium-photo/market-chart-business-glowing-stock-graph-investment-financial-data-profit-growth-money-diagram-background-with-diagram-exchange-information-3d-rendering_79161-1797.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
    },
    {
      id: 2,
      title: "Future Events",
      value: futureEvents || 0,
      icon: FaRegCalendarAlt,
      gradient: "from-purple-100 to-purple-50",
      image:
        "https://img.freepik.com/free-vector/abstract-red-light-lines-pipe-speed-zoom-black-background-technology_1142-8971.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
    },
    {
      id: 3,
      title: "Past Events",
      value: pastEvents || 0,
      icon: FaRegCalendarCheck,
      gradient: "from-blue-100 to-blue-50",
      image:
        "https://img.freepik.com/free-vector/infographic_53876-25855.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740",
    },

    {
      id: 4,
      title: "Total Delivered",
      value: deliverdEvents || 0,
      icon: FaEnvelopeOpenText,
      gradient: "from-yellow-100 to-yellow-50",
      image:
        "https://img.freepik.com/premium-psd/digital-tablet-screen-mockup-psd-smart-tech_53876-676311.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
    },
    {
      id: 5,
      title: "Total Employees",
      value: totalCount || 0,
      icon: FaUserFriends,
      gradient: "from-lime-100 to-lime-50",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-flat-design-stock-market-concept_23-2149167960.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740",
    },
    {
      id: 6,
      title: "Pending Enquiries",
      value: pendingCount || 0,
      icon: FaEnvelopeOpenText,
      gradient: "from-indigo-100 to-indigo-50",
      image:
        "https://img.freepik.com/premium-photo/chart-with-uptrend-line-graph-bar-chart-diagram-bull-market-dark-blue-background_97770-3.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_items_boosted&w=740",
    },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {stats.map((s) => {
          const Icon = s.icon;
          const isEven = s.id % 2 === 0;
          const initialAnimation = {
            opacity: 0,
            x: isEven ? -30 : 0,
            y: isEven ? 0 : -30,
          };
          return (
            <motion.div
              key={s.id}
              className={`
                bg-gradient-to-br  text-gray-950 rounded-2xl shadow-md
                flex flex-col overflow-hidden
              `}
              initial={initialAnimation}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
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
                <h4 className="text-4xl font-bold drop-shadow  text-orange-600">
                  {s.value}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default MainDashboard;
