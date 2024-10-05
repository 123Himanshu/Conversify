import Image from "next/image";

const Avatar = ({ image, online }: { image: any; online?: boolean }) => {
  return (
    <div className="relative">
      <div className="relative rounded-full inline-block overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          alt="Avatar"
          src={image || "/images/user-avatar.jpeg"}
          className="object-cover object-top"
          fill
          sizes="100%"
        />
      </div>
    </div>
  );
};

export default Avatar;
