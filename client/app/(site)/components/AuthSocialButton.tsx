import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  label?: string;
  onClick?: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => {
  return (
    <div className="w-full rounded-md shadow-sm flex justify-center text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-[#002a53] px-4 py-2 focus:outline-offset-0 cursor-pointer">
      <button onClick={onClick} className="flex items-center gap-2">
        <Icon />
        <span>{label}</span>
      </button>
    </div>
  );
};

export default AuthSocialButton;
