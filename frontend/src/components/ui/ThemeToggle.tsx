import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleTheme();
      }}
      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
