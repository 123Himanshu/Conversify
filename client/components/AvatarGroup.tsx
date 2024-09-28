"use client";

import Image from "next/image";

interface AvatarGroupProps {
  users: any[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user._id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image
            alt="Image"
            fill
            className="object-cover object-top"
            src={user?.image || "/images/user-avatar.jpeg"}
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
