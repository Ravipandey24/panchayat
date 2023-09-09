"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { DateTime } from "luxon";
import { useDashboardDispatchContext } from "../providers/dashboard-provider";


interface SingleChatProps {
  conversationId: string;
  currentUser: UserProfile;
  partner: UserProfile;
  initialMessages: Message[];
}

const formatTimestamp = (timestamp: string) => {
  var overrideZone = DateTime.fromISO(timestamp, { zone: "utc" }).toLocal();  
  return overrideZone.toFormat("t")
}

const SingleChatSection = ({ conversationId, initialMessages, currentUser, partner }: SingleChatProps) => {
  const dispatch = useDashboardDispatchContext()
  const activeConversation = {
    type: 'single',
    title: partner.name,
    conversationId
  }
  dispatch({type: 'CHANGE_CONVERSATION', value: activeConversation})

  const [messages, setMessages] = useState<Message[]>(
    initialMessages
  );
  const [isClient, setIsClient] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {    
    pusherClient.subscribe(toPusherKey(`single_conversation:${conversationId}`));
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: Message) => {      
      // axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        // if (find(current, { _id: message._id })) {
        //   return current;
        // }

        return [message, ...current];
      });

      bottomRef?.current?.scrollIntoView();
    };

    // const updateMessageHandler = (newMessage: Message) => {
    //   setMessages((current) =>
    //     current.map((currentMessage) => {
    //       if (currentMessage._id === newMessage._id) {
    //         return newMessage;
    //       }

    //       return currentMessage;
    //     })
    //   );
    // };

    // pusherclient creates an instance with invokes the function whenever incoming-message is triggered in server for corresponding subscription.
    pusherClient.bind("incoming-message", messageHandler);
    // pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(`single_conversation:${conversationId}`);
      pusherClient.unbind("incoming-message", messageHandler);
      // pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="w-full flex-1 justify-between flex flex-col h-[calc(100vh-162px)]">
      { isClient && <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div ref={bottomRef} />

        {messages.map((message: Message, index: number) => {
          const isCurrentUser = currentUser._id === message.senderId;

          const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId;

          return (
            <div
              className="chat-message"
              key={index}
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
                    className={cn(
                      "px-4 py-2 rounded-lg inline-block",
                      {
                        "bg-gray-600 text-gray-200": isCurrentUser,
                        "bg-primary text-primary-foreground": !isCurrentUser,
                        "rounded-br-none":
                          !hasNextMessageFromSameUser && isCurrentUser,
                        "rounded-bl-none":
                          !hasNextMessageFromSameUser && !isCurrentUser,
                      }
                    )}
                  >
                    <p className="md:text-md text-sm">{message.text}{" "}</p>
                    <p className="flex w-full place-content-end text-xs text-gray-400 lowercase">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </span>
                </div>

                <div
                  className={cn("relative w-8 h-8", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        isCurrentUser
                          ? currentUser.image
                          : partner.image
                      }
                      alt="user"
                    />
                    <AvatarFallback>
                      {currentUser.name
                        .split(" ")
                        .map((text) => text[0].toUpperCase())
                        .join()
                        .replaceAll(",", "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          );
        })}
      </div>}
      {/* <div className="bottom-0" ref={bottomRef} /> */}
    </div>
  );
};

export default SingleChatSection;
