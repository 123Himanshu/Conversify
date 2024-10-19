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
  }, [data, selected, user?._id, router]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3 dark:bg-primary dark:hover:bg-tertiary",
        selected ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-white"
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
            <p
              className={clsx(
                "text-base font-medium text-black capitalize",
                selected ? "text-white" : "text-black dark:text-white"
              )}
            >
              {data.isGroup
                ? data.name
                : data.userIds.map((userId: any) =>
                    userId?._id !== user?._id ? userId?.name : ""
                  )}
            </p>
            {lastMessage?.createdAt && (
              <p
                className={clsx(
                  "text-xs font-light",
                  selected ? "text-white" : "text-gray-500 dark:text-white"
                )}
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen ? "font-light" : "font-bold",
              selected ? "text-white" : "text-gray-800 dark:text-white"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
