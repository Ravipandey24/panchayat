import { cn } from "@/lib/utils";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface messageProps {
  user: User | undefined;
}

const Messages: FC<messageProps> = ({ user }) => {
//   const formatTimestamp = (timestamp: number) => {
//     return format(timestamp, "HH:mm");
//   };
 const messages: any = [
    {
        text: 'nigga'
    },
    {
        text: 'heyy buddy'
    }
 ]

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {/* <div ref={scrollDownRef} /> */}

      {messages.map((message: any, index: Number) => {
        // const isCurrentUser = message.senderId === user.id;
        const isCurrentUser = true

        const hasNextMessageFromSameUser = true
        // const hasNextMessageFromSameUser =
        //   messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className="chat-message"
            // key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block text-md sm:text-sm", {
                    "bg-primary text-primary-foreground": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {/* {formatTimestamp(message.timestamp)} */}
                    timestamp
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: false,
                })}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={""} alt="user" />
                  <AvatarFallback>{user?.name.split(' ').map((text) => text[0].toUpperCase()).join().replaceAll(',', '')}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
