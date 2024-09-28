import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Input } from "../Inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/user/userSlice";
import ImageOpener from "../ImageOpener";

interface SettingsModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/authorization`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data) {
          dispatch(setUser(data.user));
          console.log(user);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.log("Error", error);
        router.push("/");
      }
    };
    getUser();
  }, []);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: user?.name,
      image: user?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => {
    setIsLoading(true);
    if (data.image === user?.image && data.name === user?.name) {
      setIsLoading(false);
      onClose();
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/settings`, {
        ...data,
        userId: user?._id,
      })
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        router.refresh();
        toast.success("Profile Updated");
        onClose();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ImageOpener
        image={image}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 to-gray-900 dark:text-accent-3">
                Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-accent-4">
                Edit Your Profile
              </p>
              <div className="flex flex-col mt-10 gap-y-8">
                <Input
                  disabled={isLoading}
                  label="Name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <Image
                      width={48}
                      height={48}
                      src={image || user?.image || "/images/user-avatar.jpeg"}
                      alt="avatar"
                      className="rounded-full cursor-pointer"
                      onClick={() => setIsImageOpen(true)}
                    />
                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onUpload={handleUpload}
                      uploadPreset="e9gou36i"
                    >
                      <Button disabled={isLoading} secondary type="button">
                        Change
                      </Button>
                    </CldUploadButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                disabled={isLoading}
                type="button"
                secondary
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit" onClick={onClose}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SettingsModal;
