"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CloudUpload, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export default function NewEmployeeForm() {
  const router = useRouter();
  const addEmployee = useEmployeeStore((state) => state.addEmployee);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [licenseFile, setLicenseFile] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".pdf"],
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "Driver" && (!licenseFile || licenseFile.length === 0)) {
      toast.error("Please upload a driver license.");
      return;
    }

    const employeeData = {
      name,
      email,
      phone,
      role,
      license: role === "Driver" ? licenseFile?.[0] : null,
    };

    console.log("Employee Data:", employeeData);
    addEmployee(employeeData);

    toast.success("Employee added successfully!");
    router.push("/dashboard/employees");
  };

  return (
    <main className="container mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter employee name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {role === "Driver" && (
          <div>
            <Label htmlFor="license">Upload Driver`&apos;`s License</Label>
            <FileUploader
              value={licenseFile}
              id="license"
              onValueChange={setLicenseFile}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-background rounded-lg p-2"
            >
              <FileInput className="outline-dashed outline-1 outline-slate-500">
                <div className="flex flex-col items-center p-8 w-full space-y-2">
                  <CloudUpload className="text-gray-500 w-10 h-10" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, PDF up to 2MB
                  </p>
                </div>
              </FileInput>

              <FileUploaderContent>
                {licenseFile?.map((file, i) => (
                  <FileUploaderItem key={i} index={i}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLicenseFile(
                            (prev) =>
                              prev?.filter((_, index) => index !== i) || null
                          )
                        }
                        className="p-1 bg-slate-50 rounded-full hover:bg-red-200 transition-all hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4 stroke-current" />
                      </button>
                    </div>
                  </FileUploaderItem>
                ))}
              </FileUploaderContent>
            </FileUploader>
          </div>
        )}

        <Button type="submit" className="w-full md:w-auto">
          Submit Employee
        </Button>
      </form>
    </main>
  );
}
