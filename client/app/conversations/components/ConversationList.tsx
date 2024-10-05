"use client";
import useConversation from "@/hooks/useConversation";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import toast from "react-hot-toast";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user/user/userSlice";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";
import ConversationSkeleton from "./conversationSkeleton";

interface ConversationListProps {
  intialItems: any[];
}

const ConversationList = () => {
  const { isOpen, conversationId } = useConversation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const skeletons = 10;

  const pusherKey = useMemo(() => {
    return user?.email;
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/all`, {
            params: {
              userId: user?._id,
            },
          })
          .then((res) => {
            if (res.data.length < 1) return;
            setConversations(res.data);
          })
          .catch((err) => {
            toast.error(err.msg);
            console.log(err);
          });
      }
    };

    const fetchUsers = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/authorization`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data) {
          dispatch(setUser(data.user));
          if (data?.user?.email) {
            axios
              .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getallusers`, {
                params: { email: data.user?.email },
              })
              .then((res) => {
                setAllUsers(res.data.users);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else router.push("/");
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchConversations();
    fetchUsers();
  }, [user?._id]);

  useEffect(() => {
    if (!pusherKey) return;
    pusherClient.subscribe(pusherKey);

    const newConversationHandler = (newConversation: any) => {
      console.log(newConversation);
      setConversations((prev) => {
        if (find(prev, { _id: newConversation?._id })) {
          return prev;
        }
        return [newConversation, ...prev];
      });
    };

    const deletedConversationHandler = (deletedConversation: any) => {
      console.log(deletedConversation);
      setConversations((prev) => {
        return [
          ...prev.filter((convo) => convo?._id != deletedConversation?._id),
        ];
      });
      if (conversationId == deletedConversation?._id) {
        router.push("/conversations");
      }
    };

    const conversationUpdateHandler = (updatedConversation: any) => {
      // console.log(conversations);
      const updateConversation = conversations.find(
        (convo) => convo?._id == updatedConversation?._id
      );

      if (updateConversation) {
        updateConversation.messages = updatedConversation?.messages;
        const allConversations = conversations.filter(
          (convo) => convo?._id != updatedConversation?._id
        );
        setConversations([updateConversation, ...allConversations]);
      }
    };

    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:delete", deletedConversationHandler);
    pusherClient.bind("conversation:update", conversationUpdateHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("conversation:delete", deletedConversationHandler);
      pusherClient.unbind("conversation:update", conversationUpdateHandler);
    };
  }, [pusherKey, conversationId, router, conversations, user?._id]);

  return (
    <>
      <GroupChatModal
        users={allUsers}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 dark:bg-primary dark:border-slate-800",
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800 dark:text-accent-3">
              Messages
            </div>
            <div
              onClick={() => setIsGroupModalOpen(true)}
              className="rounded-full p-2 bg-gradient-to-br from-blue-400 to-blue-600 text-slate-200 cursor-pointer hover:opacity-75 transition dark:bg-secondary dark:text-accent-1 dark:ring-slate-300"
            >
              <MdOutlineGroupAdd size={22} />
            </div>
          </div>
          {conversations.length > 0
            ? conversations.map((item, index) => (
                <ConversationBox
                  key={index}
                  data={item}
                  selected={conversationId === item?._id}
                />
              ))
            : [...Array(skeletons)].map((_, index) => (
                <ConversationSkeleton key={index} />
              ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
