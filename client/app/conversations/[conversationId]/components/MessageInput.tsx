"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  placeholder,
  type,
  register,
  required,
}) => {
  return (
    <div className="relative w-full z-20">
      <input
        id={id}
        type={type || "text"}
        autoComplete={"off"}
        placeholder={placeholder}
        {...register(id, { required })}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-xl focus:outline-none dark:bg-primary dark:text-accent-3"
      />
    </div>
  );
};

export default MessageInput;
