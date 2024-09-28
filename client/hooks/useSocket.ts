import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export const useSocket = () => {
  const user = useAppSelector((state) => state.user.user);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<Array<any>>([]);
  useEffect(() => {
    // socket.on("connection", () => setSocketConnected(true));
    socket.emit("setup", user);
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessage: any) => {
      console.log("New Message ", newMessage);
      setMessages([...messages, newMessage]);
    });
  });

  return { socket, messages, setMessages };
};
