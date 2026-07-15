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
  placeholder = "Search by name, email, phone...",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "w-full md:max-w-md flex items-center gap-3 bg-gradient-to-br from-brand-50 via-white to-brand-50 border border-brand-200 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <Search className="w-5 h-5 text-muted-foreground shrink-0" />

      <input
        type="text"
        value={searchValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm bg-transparent border-none ring-0 focus:ring-0 active:border-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
      />

      {searchValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
