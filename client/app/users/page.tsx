// "use client";
// import { useAppSelector } from "../redux/hooks";

import EmptyStack from "@/components/EmptyStack";

const User = () => {
  // const user = useAppSelector((state) => state.user.user);
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyStack />
    </div>
  );
};

export default User;
