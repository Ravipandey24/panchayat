import React from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardProvider from "@/components/providers/dashboard-provider";
import GroupConversation from "@/lib/models/group-conversation.model";


const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const allGroups = await GroupConversation.find({ participants: session.user.profileId })
  let groupData: Group[] = allGroups.map((group) => ({ id: group._id, title: group.name, image: group.image }) )
  groupData = JSON.parse(JSON.stringify(groupData));

  const userData = {
    image: session?.user.image,
    title: session?.user.name,
  } as Group;
  const userProfile = JSON.parse(JSON.stringify(session.user));

  return (
    <DashboardProvider>
      <div className="flex flex-row">
        <Sidebar userData={userData} groupData={groupData}></Sidebar>
        <div className='w-full'>
          <Header userData={userProfile}></Header>
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Layout;
