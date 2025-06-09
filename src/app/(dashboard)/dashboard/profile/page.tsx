"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";

export default function AdminProfilePage() {
  const router = useRouter();
  const admin = useUserStore((state) => state.user);

  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState("");

  const adminId = admin?._id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId) {
      alert("Admin ID not found");
      return;
    }
    const updateData: any = { name, email };
    if (password.trim() !== "") {
      updateData.password = password;
    }

    try {
      const res = await fetch(`/api/v1/admin/edit-admin/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
  body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Update failed: " + (errorData.message || "Unknown error"));
        return;
      }

      alert("Admin profile updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Update Admin Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold">
            Password (leave blank to keep unchanged)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </main>
  );
}
