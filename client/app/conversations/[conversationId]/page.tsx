"use client";

import EmptyStack from "@/components/EmptyStack";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import { useAppSelector } from "@/redux/hooks";

interface IParams {
  conversationId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {
  const [conversation, setConversation] = useState();
  const [messages, setMessages] = useState<any>([]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${params.conversationId}`
  //     )
  //     .then((res) => {
  //       setConversation(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/${params.conversationId}`
  //     )
  //     .then((res) => {
  //       // console.log(res)
  //       setMessages(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return conversation ? (
    <div className=" lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <Header conversation={conversation} />
        <Body messages={messages} setMessages={setMessages} />
        <Form />
      </div>
    </div>
  ) : (
    <div className=" lg:pl-80 h-full">
      <div className="flex flex-col h-full">
        <EmptyStack />
      </div>
    </div>
  );
};

export default ConversationId;
