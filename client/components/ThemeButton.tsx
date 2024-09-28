"use client";
import { useEffect, useState } from "react";
import { IoIosSunny } from "react-icons/io";
import { FiMoon } from "react-icons/fi";

const ThemeButton = () => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <button
      className="hover:bg-gray-200 dark:hover:bg-tertiary p-[10px] rounded-lg transition"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <FiMoon size={20} color="white" /> : <IoIosSunny size={20} />}
    </button>
  );
};

export default ThemeButton;
