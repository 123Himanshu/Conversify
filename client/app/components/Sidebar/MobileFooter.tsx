"use client";
import useRoutes from "../hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  return (
    <div className="lg:hidden w-full fixed bottom-0 flex justify-between items-center overflow-x-auto bg-white dark:bg-[#001c3b] border-t-[1px]">
      {routes.map((route) => (
        <MobileItem
          key={route.label}
          href={route.href}
          label={route.label}
          icon={route.icon}
          onClick={route.onClick}
          active={route.active}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
