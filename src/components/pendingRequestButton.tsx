'use client'

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { cn, toPusherKey } from "@/lib/utils";
import { Button } from "./ui/button";
import { pusherClient } from "@/lib/pusher";


interface PendingRequestButtonProps {
    requestCount: number
    userId: string
}

const PendingRequestButton: FC<PendingRequestButtonProps> = ({ requestCount, userId }) => {
    const [newRequest, setNewRequest] = useState<number>(requestCount)
    
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`friend_request:${userId}`));

        const incomingRequestHandler = (_: UserProfile) => {
            setNewRequest(prev => prev + 1)
        }
        pusherClient.bind('incoming-friend-request', incomingRequestHandler);
        
        return () => {
            pusherClient.unsubscribe(`friend_request:${userId}}`);
            pusherClient.unbind('incoming-friend-request', incomingRequestHandler);
        };
    }, [userId])
    

    return (
    <Link href="/dashboard/requests">
      <Button
        type="button"
        variant="outline"
        className="flex p-2 justify-between gap-4 text-xs text-gray-400 w-full hover:bg-background/70"
      >
        <span>Pending requests</span>
        <span
          className={cn(
            "bg-foreground w-4 h-4 rounded-full text-background font-semibold",
            { invisible: newRequest === 0 }
          )}
        >
          { newRequest }
        </span>
      </Button>
    </Link>
  );
};

export default PendingRequestButton;
