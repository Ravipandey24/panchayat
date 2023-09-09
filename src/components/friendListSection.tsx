"use client";

import { FC, useEffect, useState } from "react";
import { List, ListItem } from "./ui/list";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import TooltipButton from "./ui/tooltip-button";
import { BsChatLeftFill, BsThreeDotsVertical } from "react-icons/bs";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import PlaceholderCard from "./placeholderCard";

interface FriendListSectionProps {
  initialFriendList: UserProfile[];
  userId: string;
}

const FriendListSection: FC<FriendListSectionProps> = ({
  initialFriendList,
  userId,
}) => {
  const [friendList, setFriendList] =
    useState<UserProfile[]>(initialFriendList);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`friends:${userId}`));
    const newFriendHandler = (newFriendProfile: UserProfile) => {
      setFriendList((prev) => [newFriendProfile, ...prev]);
    };
    pusherClient.bind("new-friend-addition", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(`friends:${userId}}`);
      pusherClient.unbind("new-friend-addition", newFriendHandler);
    };
  }, []);

  if (friendList.length === 0) {
    return (
      <PlaceholderCard text="You have no friends!"></PlaceholderCard>
    )
  }
  return (
    <List className="space-y-2">
      { friendList.map((friend: UserProfile) => (
        <ListItem
          key={friend._id}
          href={`/dashboard/chat/${friend.username}`}
          className="group justify-between border-t-[1px] border-gray-800 py-2.5 pr-3"
          noVerticalPadding
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={friend.image} alt="user" />
              <AvatarFallback>
                {friend.name
                  .split(" ")
                  .map((text) => text[0].toUpperCase())
                  .join()
                  .replaceAll(",", "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 leading-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-200">
                <span className="font-semibold">{friend.name}</span>
                <span className="hidden text-xs text-gray-400 group-hover:block">
                  {friend.username}
                </span>
              </div>
              {/* <div className="text-[13px] text-gray-300">
            {t(`user.status.${friend.status}`)}
          </div> */}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <TooltipButton tooltipContent="Message">
              <BsChatLeftFill />
            </TooltipButton>
            <TooltipButton tooltipContent="More">
              <BsThreeDotsVertical />
            </TooltipButton>
          </div>
        </ListItem>
      ))}
    </List>
  );
};

export default FriendListSection;
