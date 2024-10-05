"use client";

import useConversation from "@/hooks/useConversation";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { useState } from "react";
import Tippy from "@tippyjs/react";
import { useAppSelector } from "@/redux/hooks";
import { CldUploadButton } from "next-cloudinary";
import toast from "react-hot-toast";
import { useReplyContext } from "./ReplyMessageContext";
import { RxCross2 } from "react-icons/rx";

const Form = () => {
  const { conversationId } = useConversation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const { replyMessage, setReplyMessage } = useReplyContext();
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const theme = document.documentElement.contains(
    document.querySelector(".dark")
  )
    ? "dark"
    : "light";

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  window.addEventListener("resize", (e) => {
    setScreenSize(window.innerWidth);
  });

  window.addEventListener("click", (e) => {
    if (e.target === document.body) {
      setIsPickerVisible(false);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsPickerVisible(false);
    }
  });

  window.addEventListener("scroll", (e) => {
    setIsPickerVisible(false);
  });

  window.addEventListener("resize", (e) => {
    setIsPickerVisible(false);
  });

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key == ",") {
      setIsPickerVisible(!isPickerVisible);
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setValue("message", "", { shouldValidate: true });
    // console.log(replyMessage);
    const rm = replyMessage;
    setReplyMessage(null);
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages`, {
        ...data,
        conversationId,
        sender: user?._id,
        replyMessage: rm,
      })
      .then((res) => {
        // socket.emit("new message", res.data);
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      })
      .finally(() => {
        setReplyMessage(null);
      });
    // console.log(data);
  };

  function handleUpload(result: any) {
    const image = result?.info?.secure_url;
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages`, {
      image,
      conversationId,
      sender: user?._id,
    });
  }

  return (
    <div className="flex flex-col w-full">
      {replyMessage && (
        <div className="flex border-t border-gray-300 bg-white dark:border-slate-800">
          <div className="flex-1 flex bg-neutral-100 h-11 overflow-hidden dark:bg-tertiary dark:text-accent-1">
            <div className="h-full w-1 bg-blue-400 rounded-xl"></div>
            <div className="pl-3 p-1 h-full w-full overflow-hidden select-none whitespace-nowrap flex items-center text-ellipsis">
              {replyMessage.body}
            </div>
          </div>
          <div className="p-2 dark:bg-secondary dark:text-accent-3">
            <RxCross2
              size={26}
              onClick={() => setReplyMessage(null)}
              cursor={"pointer"}
            />
          </div>
        </div>
      )}
      <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full z-20 dark:bg-secondary dark:border-slate-800">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUpload}
          uploadPreset="e9gou36i"
        >
          <HiPhoto size={30} className="text-sky-500 cursor-pointer" />
        </CldUploadButton>
        <div className="relative">
          <Tippy content="Ctrl + ," hideOnClick touch={["hold", 1000]}>
            <div className="cursor-pointer text-sky-600 font-bold">
              <MdEmojiEmotions
                size={25}
                onClick={() => {
                  setIsPickerVisible(!isPickerVisible);
                }}
              />
            </div>
          </Tippy>
          <div className="absolute bottom-10 -left-12">
            {isPickerVisible && (
              <Picker
                data={data}
                onEmojiSelect={(e: any) => {
                  const currentMessage = watch("message");
                  const newMessage = currentMessage + e.native;
                  setValue("message", newMessage, { shouldValidate: true });
                  document.getElementById("message")?.focus();
                }}
                onClickOutside={() => setIsPickerVisible(false)}
                theme={theme}
                icons="outline"
                previewPosition="none"
                emojiButtonSize={screenSize <= 370 ? "30" : "36"}
                emojiSize={screenSize <= 370 ? "20" : "24"}
              />
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required={true}
            placeholder="Write a message"
          />
          <Tippy content="Send" hideOnClick touch={["hold", 1000]}>
            <button
              type="submit"
              className="rounded-full p-3 bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer hover:to-blue-700 hover:from-blue-500 transition dark:bg-primary dark:hover:bg-secondary"
            >
              <HiPaperAirplane size={18} className="text-white" />
            </button>
          </Tippy>
        </form>
      </div>
    </div>
  );
};

export default Form;
