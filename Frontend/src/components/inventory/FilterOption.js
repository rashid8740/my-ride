// src/components/inventory/FilterOption.jsx
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FilterOption({ label, options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base font-semibold text-gray-900">{label}</h3>
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                checked={selected.includes(option.value)}
                onChange={() => {
                  if (selected.includes(option.value)) {
                    onChange(selected.filter((item) => item !== option.value));
                  } else {
                    onChange([...selected, option.value]);
                  }
                }}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
              {option.count && (
                <span className="text-xs text-gray-500">({option.count})</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
