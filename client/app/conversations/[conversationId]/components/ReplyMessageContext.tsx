import { createContext, useContext, useState } from "react";

export const ReplyContext = createContext<any>(null);

const ReplyMessageContext = ({ children }: { children: React.ReactNode }) => {
  const [replyMessage, setReplyMessage] = useState<any>(null);

  return (
    <ReplyContext.Provider value={{ replyMessage, setReplyMessage }}>
      {children}
    </ReplyContext.Provider>
  );
};

export default ReplyMessageContext;

export const useReplyContext = () => useContext(ReplyContext);
