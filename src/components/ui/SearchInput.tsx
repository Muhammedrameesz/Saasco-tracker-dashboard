import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ className, onClear, value, ...props }: SearchInputProps) {
  return (
    <div className={`relative flex items-center w-full md:max-w-md ${className || ''}`}>
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        className="pl-9 pr-9"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
