"use client";

import { FC, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { IconCheck, IconClose } from "./ui/icons";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import PlaceholderCard from "./placeholderCard";
import { useToast } from "@/components/ui/use-toast"


interface friendRequestSectionProps {
  initialProfiles: UserProfile[];
  userId: string;
}

const FriendRequestSection: FC<friendRequestSectionProps> = ({
  initialProfiles,
  userId,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const { toast } = useToast();
  const router = useRouter();
  const handleResponse = async (payload: respondFriendRequest) => {
    try {
      await axios.post("/api/friend_request/respond", payload);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error({ message: error.response?.data });
        return;
      }
      console.error({ message: "Something went wrong." });
    }
  };

  useEffect(() => {
    axios.post("/api/friend_request/seen");
    pusherClient.subscribe(toPusherKey(`friend_request:${userId}`));

    const incomingRequestHandler = (newRequestProfile: UserProfile) => {
      axios.post("/api/friend_request/seen");
      setProfiles((prev) => [newRequestProfile, ...prev]);
    };
    pusherClient.bind("incoming-friend-request", incomingRequestHandler);

    return () => {
      pusherClient.unsubscribe(`friend_request:${userId}}`);
      pusherClient.unbind("incoming-friend-request", incomingRequestHandler);
    };
  }, [userId]);

  return (
    <div className="p-2 space-y-2">
      {profiles.length === 0 ? (
        <PlaceholderCard text="You have no pending requests!"></PlaceholderCard>
      ) : (
        profiles.map((user) => (
          <Card key={user.email}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((text) => text[0].toUpperCase())
                        .join()
                        .replaceAll(",", "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() =>
                      handleResponse({
                        action: "accept",
                        requesterId: user._id,
                      })
                    }
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                  >
                    <IconCheck></IconCheck>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      handleResponse({
                        action: "decline",
                        requesterId: user._id,
                      })
                    }
                    className="rounded-full text-red-500 hover:border-red-300 hover:bg-red-400/80"
                  >
                    <IconClose></IconClose>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FriendRequestSection;
