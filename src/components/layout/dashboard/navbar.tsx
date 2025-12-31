"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { adminAuthStore } from "@/store/adminAuthStore";
import { ChevronDown, LogOut } from "lucide-react";

function Navbar() {
  const { adminDatas, logout } = adminAuthStore();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 left-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center justify-between h-full px-5 md:px-8">
          {/* Left Section - Page Title */}
          <div className="flex items-center pl-0 md:pl-64">
            <div className="flex items-center gap-3">
              <div className="hidden md:flex w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Right Section - User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className=" cursor-pointer
                group flex items-center gap-3 
                px-3 py-2 rounded-xl
                hover:bg-gray-50
                active:bg-gray-100
                transition-all duration-200
                border border-transparent
                hover:border-gray-200
                focus:outline-none focus:ring-2 focus:ring-red-500/20
              "
            >
              {/* Avatar */}
              <Avatar className="h-9 w-9 border-2 border-gray-200 ring-2 ring-transparent group-hover:ring-red-500/10 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-semibold">
                  {getInitials(adminDatas?.name)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {adminDatas?.name || "Admin User"}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {adminDatas?.role || "Administrator"}
                </span>
              </div>

              {/* Chevron Icon */}
              <ChevronDown
                size={16}
                className={`
                  hidden md:block text-gray-400 
                  transition-transform duration-200
                  ${isProfileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />

                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200/80 overflow-hidden">
                    {/* User Info Section */}
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold">
                            {getInitials(adminDatas?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {adminDatas?.name || "Admin User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {adminDatas?.email || "admin@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          router.push("/dashboard/profile");
                        }}
                        className=" cursor-pointer
                          w-full flex items-center gap-3 
                          px-3 py-2.5 rounded-lg
                          text-sm font-medium text-gray-700
                          hover:bg-gray-50 hover:text-gray-900
                          transition-colors duration-150
                          group
                        "
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-600 group-hover:text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span>View Profile</span>
                      </button>

                      <div className="my-2 h-px bg-gray-100" />

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className=" cursor-pointer
                          w-full flex items-center gap-3 
                          px-3 py-2.5 rounded-lg
                          text-sm font-medium text-red-600
                          hover:bg-red-50
                          transition-colors duration-150
                          group
                        "
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;