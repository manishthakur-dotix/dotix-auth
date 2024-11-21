import React, { useState } from "react";
import "@/app/globals.css";

const Input = ({ placeholder, value, setValue, type }) => {
  const [focused, setFocused] = useState(false);
  const inputId = `input-${placeholder.replace(/\s+/g, "-").toLowerCase()}`; // Creating a unique ID based on placeholder

  return (
    <div className="relative w-full max-w-md">
      <label
        htmlFor={inputId}
        className={`absolute left-3 cursor-text transition-all bg-white px-1 ${
          focused || value
            ? "top-0 text-sm text-primary"
            : "top-1/2 text-sm font-medium text-muted-foreground"
        }`}
        style={{
          transform: focused || value ? "translateY(-50%)" : "translateY(-50%)",
        }}
      >
        {placeholder}
      </label>
      <input
        className="w-full px-3 py-[14px] border rounded-sm focus:outline-none focus:ring-[1px] focus:ring-primary focus:border-primary bg-background text-gray-700"
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
      />
    </div>
  );
};

export default Input;
