"use client";

import { format } from "date-fns";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Avatar from "@/components/Avatar";
import io from "socket.io-client";
import AvatarGroup from "@/components/AvatarGroup";

interface ConversationBoxProps {
  data: any;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const router = useRouter();
  // console.log(data);
  const user = useAppSelector((state) => state.user.user);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data._id}`);
  }, [router, data._id]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    // console.log(messages[messages.length - 1]);
    return messages[messages.length - 1];
  }, [data.messages]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    if (!user?._id) return false;
    const userIncluded = seenArray.find(
      (seenUser: any) => seenUser?._id === user?._id
    );
    if (!userIncluded) return false;
    return true;
  }, [lastMessage, user?._id]);

  const userProfileImage = useMemo(() => {
    if (data.isGroup) return;
    const image = data.userIds.map((userId: any) => {
      if (userId._id !== user?._id) {
        return userId.image;
      }
    });
    return image[0] ? image[0] : image[1];
  }, []);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3 dark:bg-primary dark:hover:bg-tertiary",
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data?.isGroup ? (
        <AvatarGroup users={data.userIds} />
      ) : (
        <Avatar image={userProfileImage} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-base font-medium text-gray-900 dark:text-accent-3 capitalize">
              {data.isGroup
                ? data.name
                : data.userIds.map((userId: any) =>
                    userId?._id !== user?._id ? userId?.name : ""
                  )}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          {/* <p
            className={clsx(
              "truncate text-sm",
              hasSeen
                ? "text-gray-500 dark:text-gray-400"
                : "text-black dark:text-white font-medium"
            )}
          >
            {lastMessageText}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
