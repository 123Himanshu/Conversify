"use client";
import { useState } from "react";
import useRoutes from "../../hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import Avatar from "../Avatar";
import { useAppSelector } from "@/redux/hooks";
import ThemeButton from "../ThemeButton";
import SettingsModal from "./SettingsModal";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const user = useAppSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SettingsModal
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="hidden lg:h-full lg:w-20 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:px-6 lg:overflow-y-auto lg:bg-white lg:dark:bg-primary lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col lg:dark:border-r-slate-800 justify-between">
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
        <nav className=" mt-4 flex flex-col gap-4 justify-between items-center">
          <ThemeButton />
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar image={user?.image} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
