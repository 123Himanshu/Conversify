"use client";
import { usePathname, useRouter } from "next/navigation";
import useConversation from "./useConversation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user/user/userSlice";

const useRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { conversationId } = useConversation();
  const dispatch = useDispatch();

  const signOut = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setUser(null));
          router.push("/");
          toast.success(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some Error Has Occured");
      });
  };

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
