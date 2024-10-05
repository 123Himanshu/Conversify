import SideBar from "@/components/Sidebar/SideBar";
import ConversationList from "./components/ConversationList";
import axios from "axios";

const ConversationLayout = ({ children }: { children: React.ReactNode }) => {
  axios.defaults.withCredentials = true;
  return (
    <SideBar>
      <div className="h-full">
        <ConversationList />
        {children}
      </div>
    </SideBar>
  );
};

export default ConversationLayout;
