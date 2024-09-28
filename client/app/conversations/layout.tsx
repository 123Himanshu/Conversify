"use client";
import SideBar from "@/components/Sidebar/SideBar";
import ConversationList from "./components/ConversationList";

const ConversationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SideBar>
      <div className="h-full">
        <ConversationList intialItems={[]} />
        {children}
      </div>
    </SideBar>
  );
};

export default ConversationLayout;
