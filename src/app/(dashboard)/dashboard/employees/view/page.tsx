"use client";
import React, { useEffect, useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export default function ViewEmployeePage() {
  const editableEmployee = useEmployeeStore((state) => state.editableEmployee);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    license: "",
  });

  useEffect(() => {
    if (editableEmployee) {
      setFormData(editableEmployee);
    }
  }, [editableEmployee]);

  if (!editableEmployee) {
    return (
      <p className="text-center mt-10">No employee selected for viewing.</p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Details</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto mt-10 p-10">
        <div className="mb-4">
          <h4 className="font-semibold">Name:</h4>
          <p>{formData.name}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Email</h4>
          <p>{formData.email}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Phone</h4>
          <p>{formData.phone}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Role</h4>
          <p>{formData.role}</p>
        </div>
        {formData.role === "Driver" && (
          <div>
            <h4 className="font-semibold">License</h4>
    <p>{formData.license?.name ?? "No file uploaded"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
