import Image from "next/image";
import { useAppSelector } from "../redux/hooks";

const Avatar = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <div className="relative">
      <div className="relative rounded-full inline-block overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          alt="Avatar"
          src={user?.image || "/images/user-avatar.jpeg"}
          fill
        />
      </div>
      <span className="absolute block top-0 right-0 bg-green-500 ring-2 ring-white rounded-full h-2 w-2 md:h-3 md:w-3" />
    </div>
  );
};

export default Avatar;
