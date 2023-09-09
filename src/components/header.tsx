"use client";

import { FC } from "react";
import UserCard from "./user-card";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { useDashboardContext } from "./providers/dashboard-provider";


const header = ({ userData }: { userData: UserProfile }) => {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("chat/");

  return (
    <div className="h-16 w-full shadow border-b flex justify-between items-center px-4">
      {!isChatPage ? (
        <>
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl">Panchayat</h1>
          </div>
          <UserCard userData={userData}></UserCard>
        </>
      ) : (
        <ChatHeader></ChatHeader>
      )}
    </div>
  );
};

const ChatHeader: FC = () => {
  const { activeConversation } = useDashboardContext()
  
  return (
    <>
      <Link href="/dashboard">
        <Button variant="ghost">
          <FaArrowLeft></FaArrowLeft>
        </Button>
      </Link>
      <h1 className="text-xl">{activeConversation?.title}</h1>
      <Button variant="ghost">
        <AiOutlineMenu></AiOutlineMenu>
      </Button>
    </>
  );
};

export default header;
