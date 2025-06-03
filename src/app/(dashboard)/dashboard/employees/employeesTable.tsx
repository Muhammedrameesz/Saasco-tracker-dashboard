"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Trash2, Pencil, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmployeeStore } from "@/store/useEmployeeStore";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  approved?: boolean;
};

export default function EmployeeTable() {
  const router = useRouter();
  const globalEmployees = useEmployeeStore((state) => state.employees);
  const setEditableEmployee = useEmployeeStore(
    (state) => state.setEditableEmployee
  );

  // Deep clone the employees to avoid reference issues
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Initialize from global store
    const enriched = globalEmployees.map((emp) => ({
      ...emp,
      approved: emp.approved ?? false,
    }));
    setEmployees(enriched);
  }, [globalEmployees]);

  const handleApprove = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === id ? { ...emp, approved: true } : emp))
    );
  };

  const handleReject = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    }
  };

  return (
    <div className="border rounded-xl my-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[200px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp, index) => (
            <TableRow key={emp._id ?? index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phone}</TableCell>
              <TableCell>{emp.role}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3 items-center flex-wrap">
                  <Eye
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-blue-600"
                    onClick={() => {
                      setEditableEmployee(emp);
                      router.push(`/dashboard/employees/view`);
                    }}
                  />
                  <Pencil
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-green-600"
                    onClick={() => {
                      setEditableEmployee(emp);
                      router.push(`/dashboard/employees/edit`);
                    }}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(emp._id)}
                  />

                  {!emp.approved ? (
                    <>
                      <button
                        onClick={() => handleApprove(emp._id)}
                        className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(emp._id)}
                        className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <Check className="text-green-600" size={20} />
                      <button
                        onClick={() => handleReject(emp._id)}
                        className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
