"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/app/redux/hooks";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/slices/user/user/userSlice";

type Variant = "LOGIN" | "REGISTER";

export const AuthForm = () => {
  const SERVER_URL = "http://localhost:8000";
  axios.defaults.withCredentials = true;
  const router = useRouter();
  const [variant, setvariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${SERVER_URL}/authorization`;
        const { data } = await axios.get(url, { withCredentials: true });
        if (data) {
          dispatch(setUser(data.user));
          router.push("/users");
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    getUser();
  }, []);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setvariant("REGISTER");
    } else {
      setvariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      axios
        .post("http://localhost:8000/auth/signup", data)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res?.data.msg);
            setvariant("LOGIN");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const errorMessage: string =
              error.response?.data.msg || "Something Error Has Occured";
            setIsLoading(false);
            toast.error(errorMessage);
          } else toast.error("Something went wrong");
        });
    }

    if (variant === "LOGIN") {
      axios
        .post("http://localhost:8000/auth/login", data)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res?.data.msg);
            router.push("/users");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const errorMessage: string =
              error.response?.data.msg || "Something Error Has Occured";
            setIsLoading(false);
            toast.error(errorMessage);
          } else toast.error("Something went wrong");
        });
    }
  };

  // const socialAction = (action: string) => {
  //   setIsLoading(true);
  //   try {
  //     if (action === "google") {
  //       window.location.href = "http://localhost:8000/auth/google";
  //     } else {
  //       toast.error("Unsupported social action");
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error in socialAction:", error);
  //     setIsLoading(false);
  //     toast.error("Something went wrong");
  //   }
  // };

  return (
    <div className="mt-6 max-w-sm mx-auto sm:w-full sm:mx-auto sm:max-w-md">
      <div className="bg-white dark:bg-[#001c3b] mx-4 sm:mx-0 shadow px-4 py-8 rounded-lg sm:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {variant === "REGISTER" && (
            <Input
              label="name"
              id="name"
              type="text"
              required={true}
              register={register}
              placeholder="Enter your name here..."
              disabled={isLoading}
              errors={errors}
            />
          )}
          <Input
            label="Email"
            id="email"
            type="email"
            register={register}
            placeholder="Enter your email here..."
            disabled={isLoading}
            errors={errors}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            register={register}
            placeholder="Enter your password here..."
            disabled={isLoading}
            errors={errors}
          />
          <Button fullWidth={true} disabled={isLoading} type="submit">
            {variant === "LOGIN" ? "Sign In" : "Register"}
          </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-[#001c3b] px-2 text-gray-500 dark:text-gray-200">
                Or Contiue With
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <a className="w-full" href={`${SERVER_URL}/auth/google`}>
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => setIsLoading(true)}
            />
          </a>
        </div>
        <div className="mt-6 text-center text-gray-500 dark:text-gray-300 ">
          {variant === "LOGIN" ? "New Here?" : "Already Have An Account?"}
          <span
            onClick={toggleVariant}
            className="underline cursor-pointer ml-1"
          >
            {variant === "LOGIN" ? "Create An Account" : "Login Here"}
          </span>
        </div>
      </div>
    </div>
  );
};
