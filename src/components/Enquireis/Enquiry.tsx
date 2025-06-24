"use client";

import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaPhoneVolume,
  FaUserTie,
  FaCheck,
  FaTimes,
  FaFileInvoice,
  FaCheckCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import { EmployeeI } from "@/Types/EmployeeTypes";

//================================================================//
//   1. HELPER COMPONENTS & UTILITIES
//================================================================//


const generateInitialsAvatar = (name: string): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const bgColor = "#e0e7ff";
    const textColor = "#4338ca";
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "bold 52px Arial";
    context.fillStyle = textColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initials, canvas.width / 2, canvas.height / 2);
  }
  return canvas.toDataURL();
};


const SkeletonCard = () => (
  <div className="h-64 rounded-2xl p-5 bg-white/50 shadow-md space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-300"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    </div>
    <div className="space-y-3 pt-4">
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const EnquirySkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);


const EmptyState = () => (
  <div className="text-center py-20 px-6 bg-white rounded-2xl shadow-sm">
    <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
    <h2 className="text-2xl font-bold text-gray-800">All Caught Up!</h2>
    <p className="text-gray-500 mt-2">
      There are no new pending enquiries to review.
    </p>
  </div>
);

//================================================================//
//   2. INTERACTIVE ENQUIRY CARD COMPONENT
//================================================================//
interface EnquiryCardProps {
  employee: EmployeeI;
  onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}

const EnquiryCard = ({ employee, onUpdateStatus }: EnquiryCardProps) => {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setAvatar(generateInitialsAvatar(employee.name));
  }, [employee.name]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      className="rounded-2xl p-5 bg-white/60 backdrop-blur-lg shadow-xl border border-gray-200/50  gap-5"
    >
     
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-4">
          {avatar && (
            <Image
              src={avatar}
              alt={employee.name}
              width={64}
              height={64}
              className="rounded-full border-2 border-white shadow-md"
            />
          )}

          <div>
            <h2 className="text-xl font-bold text-[#cb301b] flex items-center gap-2">
              <FaUserTie /> {employee.name}
            </h2>
            <Badge variant="secondary">{employee.role}</Badge>
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-2 pl-2 border-l-2 border-gray-200 ml-5">
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" /> {employee.email}
          </p>
          <p className="flex items-center gap-2">
            <FaPhoneVolume className="text-gray-400" /> {employee.phone}
          </p>
          
        </div>
        {employee.role === "Driver" && employee.LicenceImage && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-2 cursor-pointer" >
                View Licence
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-6">
              <DialogHeader>
                <DialogTitle className="sr-only">
                  Licence Image Preview
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center gap-4">
                <Image
                  src={employee.LicenceImage}
                  alt="Licence"
                  width={800}
                  height={600}
                  className="rounded-lg w-full object-contain max-h-[75vh]"
                />

                {employee.LicenceValidityDate && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCalendarAlt className="text-indigo-500" />
                    Valid Till:{" "}
                    <span className="font-semibold text-indigo-700">
                      {format(new Date(employee.LicenceValidityDate), "PPP")}
                    </span>
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex mt-5 justify-center items-center gap-3 pt-4 md:pt-0 pl-2 border-t md:border-t-0 md:border-l border-gray-200/80">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateStatus(employee._id, "approved")}
          className="flex cursor-pointer items-center text-[11px] justify-center w-20 h-9 gap-1.5 text-white font-semibold bg-gradient-to-br from-green-500 to-emerald-600 rounded-md shadow-md"
        >
          <FaCheck className="text-sm" /> Approve
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateStatus(employee._id, "rejected")}
          className="flex cursor-pointer items-center text-[11px] justify-center w-20 h-9 gap-1.5 text-white font-semibold bg-gradient-to-br from-red-500 to-rose-600 rounded-md shadow-md"
        >
          <FaTimes className="text-sm" /> Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

//================================================================//
//   3. MAIN ENQUIRY PAGE COMPONENT
//================================================================//

export default function Enquiry() {
  const {
    pendingEmployees,
    loading,
    getPendingEmployees,
    updateEmployeeStatus,
    pendingcurrentPage,
    pendingtotalPages,
  } = useEmployeeStore();

  useEffect(() => {
    getPendingEmployees();
  }, [getPendingEmployees]);

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    const employee = pendingEmployees.find((e) => e._id === id);
    if (employee) {
      updateEmployeeStatus(id, status);
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= pendingtotalPages) {
      getPendingEmployees(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
      <section className="bg-white py-8 px-6 md:px-12 border-b border-gray-200 rounded-xl shadow-sm mb-10 overflow-hidden relative ">
        {/* <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-[#cb301b] rounded-full opacity-20"></div> */}
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          {/* Icon and Heading */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-[#cb301b] text-white flex items-center justify-center shadow-lg">
              <FaFileInvoice className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#cb301b] tracking-tight">
                Pending Enquiries
              </h1>
              <p className="text-gray-600 text-base">
                Review and process new employee applications.
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-yellow-100 text-yellow-800 text-lg font-bold px-5 py-2 rounded-full shadow-inner">
            {pendingEmployees.length} New
          </div>
        </div>
      </section>

      {loading ? (
        <EnquirySkeletonLoader />
      ) : (
        <>
          <AnimatePresence>
            {pendingEmployees.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <EmptyState />
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pendingEmployees.map((emp) => (
                  <EnquiryCard
                    key={emp._id}
                    employee={emp}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        {/* Previous Button */}
        <Button
          onClick={() => handlePageClick(pendingcurrentPage - 1)}
          disabled={pendingcurrentPage === 1}
          className="cursor-pointer"
        >
          Previous
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: pendingtotalPages }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              onClick={() => handlePageClick(page)}
              variant={page === pendingcurrentPage ? "default" : "outline"}
              className={`w-10 px-0 cursor-pointer ${
                page === pendingcurrentPage ? "bg-primary text-white" : ""
              }`}
            >
              {page}
            </Button>
          );
        })}

       
        <Button
          onClick={() => handlePageClick(pendingcurrentPage + 1)}
          disabled={pendingcurrentPage === pendingtotalPages}
          className="cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
