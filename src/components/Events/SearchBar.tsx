"use client";

import { Search, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  searchValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  searchValue,
  onChange,
  placeholder = "Search by event name, client name...",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "w-full md:max-w-md flex items-center gap-3 bg-gradient-to-br from-orange-50 via-white to-red-50 border border-orange-200 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <Search className="w-5 h-5 text-orange-500 shrink-0" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 text-sm bg-transparent border-none ring-0 focus:ring-0 active:border-0 focus:outline-none text-gray-700 placeholder:text-orange-400",
        )}
      />
       {searchValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-orange-400 hover:text-orange-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
