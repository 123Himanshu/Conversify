import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";
import clsx from "clsx";
import Tippy from "@tippyjs/react";

interface DesktopItem {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItem> = ({
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
    <li onClick={handleClick}>
      <Tippy content={label} placement="right">
        <Link
          href={href}
          className={clsx(
            "flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-secondary",
            active && "bg-gray-100 text-black dark:bg-secondary dark:text-white"
          )}
        >
          <Icon className="h-6 w-6 shrink-0" />
          <span className="sr-only">{label}</span>
        </Link>
      </Tippy>
    </li>
  );
};

export default DesktopItem;
