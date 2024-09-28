"use client";
import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks/index";

const getConversationById = (conversationId: string) => {
  const [conversation, setConversation] = useState([]);
  const user = useAppSelector((state) => state.user.user);
  console.log(user);

  axios
    .get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${conversationId}`
    )
    .then((res) => {
      console.log(res.data);
      setConversation(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  return conversation ? conversation : [];
};

export default getConversationById;
