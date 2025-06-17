"use client";

import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import {
  FaEnvelope,
  FaUserTie,
  FaTrash,
  FaBan,
  FaRedo,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { EmployeeI } from "@/Types/EmployeeTypes";
import { FaPhoneVolume } from "react-icons/fa6";
import Spinner from "../loading/Spinner";
import { GrUpdate } from "react-icons/gr";
import EditEmployeeDialog from "./EditEmployees";

export default function EmployeesView() {
  const {
    fetchEmployees,
    deleteEmployee,
    updateEmployeeActiveStatus,
    currentPage,
    totalPages,
    loading,
    updateEmployeeStatus,
  } = useEmployeeStore();

  const employees = useEmployeeStore((state) => state.employees);


  const [selectedEmp, setSelectedEmp] = useState<EmployeeI>();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchEmployees(1);
  }, [fetchEmployees]);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    if (!selectedEmp) return;
    await updateEmployeeStatus(id, status);
    setOpenDialog(false);
  };

  const handleToggleActive = (id: string) => {
    const emp = employees.find((e) => e._id === id);
    if (emp) {
      updateEmployeeActiveStatus(emp._id, !emp.isActive);
    }
  };

  if (loading) return <Spinner />;
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <section className="bg-white py-8 px-6 md:px-12 border-b border-gray-200 rounded-xl shadow-sm mb-10 overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-[#cb301b] rounded-full opacity-20"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-[#cb301b] text-white shadow-lg">
            <FaIdCard className="text-2xl" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#cb301b] mb-2 tracking-tight">
              Employee Directory
            </h1>
            <p className="text-gray-600 text-base max-w-xl mx-auto md:mx-0">
              Seamlessly manage your workforce. Edit details, manage access, and
              update statuses—all in one elegant space.
            </p>
          </div>
        </div>
      </section>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map((employee) => (
          <motion.div
            key={employee._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={clsx(
              "rounded-xl relative border-t-8  p-5 bg-white/90 backdrop-blur shadow-md space-y-4",
              employee.status === "approved"
                ? "border-t-green-400"
                : employee.status === "rejected"
                ? "border-t-red-400"
                : "border-t-yellow-400"
            )}
          >
            {employee.role === "Driver" && employee.LicenceImage ? (
              <Image
                src={employee.LicenceImage}
                alt="Licence"
                width={400}
                height={200}
                className="rounded-md object-cover w-full h-40"
              />
            ) : (
              <Image
                src="https://img.freepik.com/premium-vector/photographer-with-camera-icon_1076610-20899.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740"
                alt="Licence"
                width={400}
                height={200}
                className="rounded-md object-contain w-full h-40"
              />
            )}

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#cb301b] flex items-center gap-2">
                <FaUserTie /> {employee.name}
              </h2>
              <p className="text-sm text-gray-700 flex items-center">
                <FaEnvelope className="mr-2" /> {employee.email}
              </p>
              <p className="text-sm text-gray-700 flex items-center">
                <FaPhoneVolume className="mr-2" /> {employee.phone}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Role: <span className="text-indigo-600">{employee.role}</span>
              </p>
              <p className="text-sm font-medium">
                Status:{" "}
                <span
                  className={clsx("capitalize font-semibold", {
                    "text-green-600": employee.status === "approved",
                    "text-yellow-600": employee.status === "pending",
                    "text-red-600": employee.status === "rejected",
                  })}
                >
                  {employee.status}
                </span>
              </p>
              <p className="text-sm font-medium">
                Active:{" "}
                <span
                  className={
                    employee.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {employee.isActive ? "Yes" : "No"}
                </span>
              </p>
              {employee.role === "Driver" && employee.LicenceValidityDate && (
                <p className="text-sm text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Valid till:{" "}
                  {format(new Date(employee.LicenceValidityDate), "PPP")}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-5 justify-center items-center mx-auto  border-t pt-3 mt-3">
              <EditEmployeeDialog
                employee={employee}
              />

              <Button
                title="Delete Employees"
                onClick={() => deleteEmployee(employee._id)}
                className="bg-red-500/20 hover:bg-red-500/40 text-white w-fit transition-colors duration-200 cursor-pointer"
              >
                <FaTrash className="mr-0 text-red-500" />
              </Button>

              <Dialog
                open={openDialog && selectedEmp?._id === employee._id}
                onOpenChange={setOpenDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    title="Update Status"
                    onClick={() => setSelectedEmp(employee)}
                    className="bg-green-500/20 hover:bg-green-500/40 text-white w-fit transition-colors duration-200 cursor-pointer"
                  >
                    {/* Update Status */}
                    <GrUpdate className="text-green-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-xs">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Update Employee Status
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Button
                      disabled={employee.status === "approved"}
                      onClick={() =>
                        handleStatusChange(employee._id, "approved")
                      }
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      disabled={employee.status === "rejected"}
                      onClick={() =>
                        handleStatusChange(employee._id, "rejected")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Reject
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => setOpenDialog(false)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                title={employee.isActive ? "Ban Employee" : "Unban Employee"}
                onClick={() => handleToggleActive(employee._id)}
                className={clsx(
                  "text-white w-fit px-3 py-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition duration-200",
                  employee.isActive
                    ? "bg-red-500/20 hover:bg-red-500/40"
                    : "bg-purple-500/20 hover:bg-purple-500/40"
                )}
              >
                {employee.isActive ? (
                  <>
                    <FaBan className="text-red-500" />
                    <span className="text-red-600 font-medium">Ban</span>
                  </>
                ) : (
                  <>
                    <FaRedo className="text-purple-600" />
                    <span className="text-purple-700 font-medium">Unban</span>
                  </>
                )}
              </Button>
            </div>
            {employee.isActive === false && (
              <div className="absolute right-[-20px] top-5 transform rotate-12 bg-red-100 border border-red-300 text-red-600 text-xs font-semibold px-3 py-1 rounded-md shadow-md flex items-center gap-1">
                <FaBan className="text-red-500 text-sm" />
                <span>Banned</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-3 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => fetchEmployees(pageNum)}
            variant={currentPage === pageNum ? "default" : "outline"}
            className={clsx(
              "rounded-full px-5",
              currentPage === pageNum ? "bg-indigo-600 text-white" : ""
            )}
          >
            {pageNum}
          </Button>
        ))}
      </div>
    </div>
  );
}
