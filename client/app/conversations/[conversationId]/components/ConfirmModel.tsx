"use client";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import useConversation from "@/hooks/useConversation";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { GoAlert, GoAlertFill } from "react-icons/go";

interface ConfirmModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModel: React.FC<ConfirmModelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations/${conversationId}`
      )
      .then(() => {
        onClose();
        router.push("/conversations");
        toast.success("Conversation deleted successfully");
        router.refresh();
      })
      .catch((error: any) => {
        toast.error(error.response.data.msg);
        console.log(error);
        setIsLoading(false);
      });
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start p-4">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className=" text-base font-semibold leading-6 text-gray-900 dark:text-accent-3"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-accent-4">
              Are you sure you want to delete this conversation?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col justify-center items-center gap-3 sm:mt-4 sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModel;
