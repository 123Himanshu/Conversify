"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/user/userSlice";
import SideBar from "@/components/Sidebar/SideBar";
import UsersList from "@/app/users/components/UsersList";
import "tippy.js/dist/tippy.css";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  const [allUsers, setAllUsers] = useState([]);
  axios.defaults.withCredentials = true;
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
                console.log(res.data.users);
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
    fetchUsers();
  }, []);
  return (
    <div className="h-full">
      <SideBar>
        <div className="h-full">
          <UsersList users={allUsers} />
          {children}
        </div>
      </SideBar>
    </div>
  );
};

export default UsersLayout;
