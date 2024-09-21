"use client";
import { useState } from "react";
import useRoutes from "../hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import Avatar from "../Avatar";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="hidden lg:h-full lg:w-20 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:px-6 lg:overflow-y-auto lg:bg-white lg:dark:bg-[#001c3b] lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((route) => (
            <DesktopItem
              key={route.label}
              href={route.href}
              label={route.label}
              icon={route.icon}
              onClick={route.onClick}
              active={route.active}
            />
          ))}
        </ul>
      </nav>
      <nav className=" mt-4 flex flex-col justify-between items-center">
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer hover:opacity-75 transition"
        >
          <Avatar />
        </div>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
