"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarSkeleton from "./skeleton/sidebar-skeleton";

const SidebarWrapper = (props: {
  userData: Group;
  groupData: Array<Group>;
}) => {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("chat/");
  const isSidebarOpen = !isChatPage;
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isSidebarOpen) {
    return (
      <>
        {isClient ? (
          <SidebarContent {...props}></SidebarContent>
        ) : (
          <SidebarSkeleton></SidebarSkeleton>
        )}
      </>
    );
  }
};

const SidebarContent = ({
  userData,
  groupData,
}: {
  userData: Group;
  groupData: Array<Group>;
}) => {
  const [activeIdx, setActiveIdx] = useState<Number>(0);
  const groupClickHandler = (data: Group, idx: Number) => {
    setActiveIdx(idx);
  };
  const iconWrapperClasses = (idx: number) =>
    activeIdx === idx
      ? "group relative h-12 w-12 bg-cover transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] rounded-[15px] cursor-pointer mx-auto mb-2 flex items-center justify-center bg-gray-500"
      : "group relative h-12 w-12 bg-cover transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] rounded-full hover:rounded-[15px] cursor-pointer mx-auto mb-2 flex items-center justify-center bg-gray-500";

  return (
    <div className="hidden-scrollbar z-40 h-screen w-[70px] gap-3 overflow-y-auto pt-2 bg-background/80 border-r">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={"/dashboard"}
              className={iconWrapperClasses(0)}
              onClick={() => groupClickHandler(userData, 0)}
            >
              {0 === activeIdx && (
                <div className="absolute -left-4 w-[9px] rounded-lg bg-white transition-all group-hover:scale-100 bottom-1 top-1"></div>
              )}
              <Avatar>
                <AvatarImage src={userData.image} alt="user" />
                <AvatarFallback>
                  {userData.title
                    .split(" ")
                    .map((text) => text[0].toUpperCase())
                    .join()
                    .replaceAll(",", "")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="font-semibold">{userData.title}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="bg-white/10 my-2 mx-auto h-0.5 w-8"></div>
      {groupData.map((data, i) => (
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard//groupchat/${data.id}`}
                className={iconWrapperClasses(i + 1)}
                onClick={() => groupClickHandler(data, i + 1)}
              >
                {i + 1 === activeIdx && (
                  <div className="absolute -left-4 w-[9px] rounded-lg bg-white transition-all group-hover:scale-100 bottom-1 top-1"></div>
                )}
                <Avatar>
                  <AvatarImage
                    className="rounded-lg"
                    src={data.image}
                    alt="user"
                  />
                  <AvatarFallback>
                    {data.title
                      .split(" ")
                      .map((text) => text[0].toUpperCase())
                      .join()
                      .replaceAll(",", "")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="font-semibold">{data.title}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default SidebarWrapper;
