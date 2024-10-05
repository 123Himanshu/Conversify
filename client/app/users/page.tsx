import EmptyStack from "@/components/EmptyStack";
import axios from "axios";

const User = () => {
  axios.defaults.withCredentials = true;
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyStack />
    </div>
  );
};

export default User;
