'use client';

import React, { useEffect, useState } from 'react';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditEmployeePage() {
  const editableEmployee = useEmployeeStore((state) => state.editableEmployee);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    license: "",
  });

  useEffect(() => {
    if (editableEmployee) {
      setFormData(editableEmployee);
    }
  }, [editableEmployee]);

  if (!editableEmployee) {
    return <p className="text-center mt-10">No employee selected for editing.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Employee:', formData);
    // Add update logic here (API call or state update)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" value={formData.role} onChange={handleChange} />
          </div>
          {formData.role === "Driver" && (
               <div>
            <Label htmlFor="role">License</Label>
            <Input id="license" name="license" value={formData.license} onChange={handleChange} />
          </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-5 md:w-auto">
          Update Employee
        </Button>
      </Form>
    </div>
  );
}
