import { useEffect } from "react";
import Cookies from "js-cookie";

const useTheme = () => {
  useEffect(() => {
    const theme = Cookies.get("theme") || "default";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
};

export default useTheme;
