"use client";
import Avatar from "@/components/Avatar";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import ImageOpener from "@/components/ImageOpener";
import AvatarGroup from "@/components/AvatarGroup";

interface HeaderProps {
  conversation: any;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const user = useAppSelector((state) => state.user.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  console.log(conversation);

  const otherUser = useMemo(() => {
    if (conversation.isGroup) {
      return;
      // return conversation.userIds.find((u: any) => u?._id !== user?._id);
    }
    return conversation.userIds.find((u: any) => u?._id !== user?._id);
  }, [conversation]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation?.userIds?.length} members`;
    }
    return "Active";
  }, [conversation]);

  return (
    <>
      <ProfileDrawer
        conversation={conversation}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
      />
      <ImageOpener
        image={otherUser?.image}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm dark:bg-primary dark:border-b-[1px] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            className=" lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer dark:text-accent-4"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation?.isGroup ? (
            <AvatarGroup users={conversation?.userIds} />
          ) : (
            <Avatar image={otherUser?.image} />
          )}
          <div
            onClick={() => setIsImageOpen(true)}
            className="flex flex-col cursor-default"
          >
            <div className=" dark:text-accent-3">
              {conversation?.name || otherUser?.name}
            </div>
            {/* <div className="text-sm font-light text-neutral-500 dark:text-accent-2">
              {statusText}
            </div> */}
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {
            setDrawerOpen(true);
          }}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition dark:text-accent-4"
        />
      </div>
    </>
  );
};

export default Header;
