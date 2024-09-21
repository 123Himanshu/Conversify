import React from "react";
import SideBar from "../components/Sidebar/SideBar";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <SideBar>{children}</SideBar>
    </div>
  );
};

export default UsersLayout;
