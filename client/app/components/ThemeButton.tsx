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
      className=" fixed top-4 right-5 border-2 border-black dark:border-gray-200 p-[5px] rounded-full"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <IoIosSunny size={20} color="white" /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeButton;
