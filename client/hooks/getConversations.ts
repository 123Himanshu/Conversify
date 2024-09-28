import axios from "axios";
import { useAppSelector } from "../redux/hooks";

const getConversations = () => {
  const user = useAppSelector((state) => state.user.user);
  if (!user) return [];
  axios
    .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/all`, {
      params: {
        userId: user?._id,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export default getConversations;
