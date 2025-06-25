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
import { UserX } from "lucide-react";
import SearchBar from "./SearchBar";
import NoSearchMatch from "../ui/NoSearchMatchUI";

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
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

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

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput.toLowerCase().trim());
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const filteredEmployees = employees.filter((employee) => {
    const lowerSearch = search.toLowerCase();

    return (
      (employee.email?.toLowerCase()?.includes(lowerSearch) ?? false) ||
      (employee.name?.toLowerCase()?.includes(lowerSearch) ?? false) ||
      (employee.LicenceValidityDate?.toLowerCase()?.includes(lowerSearch) ??
        false) ||
      (employee.phone?.toLowerCase()?.includes(lowerSearch) ?? false)
    );
  });

  if (loading) return <Spinner />;
  if (employees.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-xl max-w-7xl mx-auto"
      >
        <div className="bg-red-500/10 p-6 rounded-full mb-6">
          <UserX className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No Employees
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          You currently have no employees. Great job keeping your team clean!
        </p>
      </motion.div>
    );
  }

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

      <section className="pb-5">
        <SearchBar
          className="m-5 mr-auto"
          searchValue={searchInput}
          onChange={setSearchInput}
        />
      </section>

      {filteredEmployees.length === 0 ? (
        <NoSearchMatch />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEmployees.map((employee) => (
            <motion.div
              key={employee._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={clsx(
                "rounded-xl relative border-t-8 p-5 bg-white/90 backdrop-blur shadow-md space-y-4",
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

              <div className="flex flex-row gap-5 justify-center items-center mx-auto border-t pt-3 mt-3">
                <EditEmployeeDialog employee={employee} />

                <Dialog
                  open={openDialogId === employee._id}
                  onOpenChange={(isOpen) =>
                    setOpenDialogId(isOpen ? employee._id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      title="Delete Employee"
                      onClick={() => setOpenDialogId(employee._id)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-white w-fit transition-colors duration-200 cursor-pointer"
                    >
                      <FaTrash className="mr-0 text-red-500" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-500">
                        Confirm Deletion
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this employee?
                    </p>
                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setOpenDialogId(null)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        onClick={() => {
                          deleteEmployee(employee._id);
                          setOpenDialogId(null);
                        }}
                      >
                        Confirm Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
                        className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={employee.status === "rejected"}
                        onClick={() =>
                          handleStatusChange(employee._id, "rejected")
                        }
                        className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                      >
                        Reject
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => setOpenDialog(false)}
                        variant="outline"
                        className="cursor-pointer"
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
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex gap-2 flex-wrap items-center justify-center">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md shadow-sm mr-5">
        Showing
        <span className="font-semibold text-gray-800 ml-1">
          {currentPage}
        </span>{" "}
        of <span className="font-semibold text-gray-800">{totalPages}</span>
      </span>
          <button
            onClick={() => {
              if (currentPage > 1) {
                fetchEmployees(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={currentPage === 1}
            className={clsx(
              "px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer",
              "bg-[#ff6600] text-white shadow-sm hover:bg-[#e65c00]",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
           ← Previous
          </button>

          {/* Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => {
                  fetchEmployees(pageNum);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === pageNum}
                className={clsx(
                  "mx-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 border cursor-pointer",
                  currentPage === pageNum
                    ? "bg-[#ff6600] text-white border-transparent shadow-sm"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-[#ff6600] hover:text-[#ff6600]"
                )}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                fetchEmployees(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={currentPage === totalPages}
            className={clsx(
              "px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer",
              "bg-[#ff6600] text-white shadow-sm hover:bg-[#e65c00]",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Next →
          </button>
        </div>

        {/* Page Info */}
        
      </div>
    </div>
  );
}
