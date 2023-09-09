import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const ChatSkeleton = ({}) => {
  return (
    <div className="w-full flex-1 justify-between flex flex-col h-[calc(100vh-162px)]">
      <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {Array(10)
          .fill(0)
          .map((_, index: number) => {
            const isCurrentUser = (index + 1) % 2 === 0;
            return (
              <div className="chat-message" key={index}>
                <div
                  className={cn("flex items-end", {
                    "justify-end": isCurrentUser,
                  })}
                >
                  <Skeleton
                    className={cn(
                      "flex flex-col space-y-2 text-base max-w-xs mx-2",
                      {
                        "order-1 items-end": isCurrentUser,
                        "order-2 items-start": !isCurrentUser,
                      }
                    )}
                  >
                    <span
                      className={cn(
                        "px-4 py-2 w-52 h-14 rounded-lg inline-block text-md sm:text-sm",
                        {
                          "bg-gray-600 text-gray-200": isCurrentUser,
                          "bg-primary text-primary-foreground": !isCurrentUser,
                        }
                      )}
                    ></span>
                  </Skeleton>
                  <div
                    className={cn("relative w-8 h-8", {
                      "order-2": isCurrentUser,
                      "order-1": !isCurrentUser,
                    })}
                  >
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatSkeleton;
