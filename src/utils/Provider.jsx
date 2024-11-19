"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SessionProvider } from "next-auth/react";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    // Get the theme from cookies
    const savedTheme = Cookies.get("theme") || "default";
    setTheme(savedTheme);

    // Apply the theme to the document
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
