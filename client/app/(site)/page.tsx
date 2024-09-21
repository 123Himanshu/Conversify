import Image from "next/image";
import { AuthForm } from "./components/AuthForm";
import ThemeButton from "../components/ThemeButton";
import axios from "axios";

export default function Home() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8000";
  return (
    <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-[#1b2a41]">
      <ThemeButton />
      <div className="sm:mx-auto sm:w-full sm:max-w-full">
        <Image
          height={50}
          width={50}
          src={"/images/logo.jpeg"}
          className="mx-auto w-auto"
          alt="logo"
        />
        <h2 className="text-2xl sm:text-3xl text-center font-bold mt-6 text-gray-900 tracking-tight dark:text-gray-100">
          Sign Into Your Account
        </h2>
        <AuthForm />
      </div>
    </div>
  );
}
