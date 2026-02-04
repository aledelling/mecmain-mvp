import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full bg-surface border border-white/10 rounded-lg py-3 
            ${icon ? 'pl-10' : 'pl-4'} pr-4 
            text-white placeholder-gray-500
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}