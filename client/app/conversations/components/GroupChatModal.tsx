"use client";

import Button from "@/components/Button";
import { Input } from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => {
    // setIsLoading(true);
    console.log(data);
    if (data.members.length < 2) {
      toast.error("Group must have at least 2 members");
      return;
    }
    onClose();

    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/conversations`, {
        ...data,
        isGroup: true,
        mainUserId: user?._id,
      })
      .then((res) => {
        if (res.status == 201) {
          toast.error("Group Already Existed");
        } else {
          toast.success("Group Created Successfully");
        }
        router.refresh();
        router.push(`/conversations/${res.data._id}`);
        onClose();
      })
      .catch((err) => {
        toast.error("Something Went Wrong");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setValue("name", "");
        setValue("members", []);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-accent-3 capitalize">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-accent-4">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-6 flex flex-col gap-y-8">
              <Input
                label="Name"
                id="name"
                register={register}
                errors={errors}
                disabled={isLoading}
                required
              />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user._id,
                  label: user.name,
                }))}
                onChange={(value: Record<string, any>) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              disabled={isLoading}
              type="button"
              secondary
              onClick={() => {
                onClose();
                setValue("name", "");
                setValue("members", []);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
