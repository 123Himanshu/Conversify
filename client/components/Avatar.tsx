import Image from "next/image";

const Avatar = ({ image }: { image: any }) => {
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
      <span className="absolute block top-0 right-0 bg-green-500 ring-2 ring-white rounded-full h-2 w-2 md:h-3 md:w-3" />
    </div>
  );
};

export default Avatar;
