"use client";

import Button from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

export const AuthForm = () => {
  const router = useRouter();
  axios.defaults.withCredentials = true;
  const [variant, setvariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      try {
        const res = await axios.post("http://localhost:8000/auth/signup", data);
        if (res.status === 200) {
          toast.success(res?.data.msg);
          setvariant("LOGIN");
          setIsLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage: string = error.response?.data.msg;
          setIsLoading(false);
          toast.error(errorMessage);
        }
      }
    }
    if (variant === "LOGIN") {
      try {
        const res = await axios.post("http://localhost:8000/auth/login", data);
        if (res.status === 200) {
          toast.success(res?.data.msg);
          router.push("/dashboard");
          setIsLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage: string = error.response?.data.msg;
          setIsLoading(false);
          toast.error(errorMessage);
        }
      }
    }
  };

  return (
    <div className="mt-6 max-w-sm mx-auto sm:w-full sm:mx-auto sm:max-w-md">
      <div className="bg-white dark:bg-[#001c3b] mx-4 sm:mx-0 shadow px-4 py-8 sm:rounded-lg sm:px-8">
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
