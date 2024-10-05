"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Input } from "@/components/Inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/user/userSlice";

type Variant = "LOGIN" | "REGISTER";

export const AuthForm = () => {
  axios.defaults.withCredentials = true;
  const router = useRouter();
  const [variant, setvariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUser = async () => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/authorization`;
      await axios
        .get(url, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            dispatch(setUser(res.data.user));
            router.push("/conversations");
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(setUser(null));
          return;
        });
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
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`, data)
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
              error.response?.data.msg || "Some Error Has Occured";
            setIsLoading(false);
            toast.error(errorMessage);
          } else toast.error("Something went wrong");
        });
    }

    if (variant === "LOGIN") {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, data)
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            toast.success(res?.data.msg);
            router.push("/conversations");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const errorMessage: string =
              error.response?.data.msg || "Some Error Has Occured";
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
      <div className="bg-white dark:bg-secondary mx-4 sm:mx-0 shadow px-5 py-8 rounded-lg sm:px-8">
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
              <span className="bg-white dark:bg-secondary px-2 text-gray-500 dark:text-accent-4">
                Or Contiue With
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <a
            className="w-full"
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`}
          >
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => setIsLoading(true)}
            />
          </a>
        </div>
        <div className="mt-6 text-center text-gray-500 dark:text-accent-4 ">
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
