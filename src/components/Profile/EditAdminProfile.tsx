"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAuthStore } from "@/store/adminAuthStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaEdit, FaEnvelope, FaPhone, FaUser, FaUserTag } from "react-icons/fa";

// Zod schema
const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone is too short"),
  role: z.string().min(2, "Role is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EditAdminProfileDialog() {
  const { adminDatas,updateAdminProfile } = adminAuthStore();
  const [open, setOpen] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: adminDatas.name,
      email: adminDatas.email,
      phone: adminDatas.phone,
      role: adminDatas.role,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: ProfileForm) => {
    await updateAdminProfile(data)  
    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center bg-white gap-2 p-1 rounded-lg border border-gray-100 hover:shadow-md transition cursor-pointer">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full text-lg">
            <FaEdit />
          </div>
          <h1 className="text-gray-800 font-medium text-sm">Edit Profile</h1>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-orange-600 text-lg font-bold">
            Edit Admin Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <FaUser /> Name
            </label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <FaEnvelope /> Email
            </label>
            <Input {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <FaPhone /> Phone
            </label>
            <Input {...register("phone")} />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <FaUserTag /> Role
            </label>
            <Input {...register("role")} />
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
