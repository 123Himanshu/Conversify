import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";
import clsx from "clsx";

interface MobileItem {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItem> = ({
  label,
  icon: Icon,
  href,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <Link
      onClick={handleClick}
      href={href}
      className={clsx(
        "flex justify-center w-full rounded-md py-6 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 dark:text-accent-3 dark:hover:text-white dark:hover:bg-primary cursor-pointer",
        active && "bg-gray-100 text-black dark:bg-primary dark:text-white"
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
