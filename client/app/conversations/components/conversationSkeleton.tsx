import { Skeleton } from "@/components/skeleton";

const ConversationSkeleton = () => {
  return (
    <div className="flex items-center gap-3 w-full p-3">
      <Skeleton className="h-12 w-12 rounded-[50%]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-36 h-3" />
        <Skeleton className="w-28 h-3" />
      </div>
    </div>
  );
};

export default ConversationSkeleton;
