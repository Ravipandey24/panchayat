import ChatPage from "@/components/chatpage/page";
import { authOptions } from "@/lib/auth";
import GroupConversation from "@/lib/models/group-conversation.model";
import Profile from "@/lib/models/profile.model";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const conversationDoc = await GroupConversation.findById(params.id);
  if (!conversationDoc) notFound();

  const getProfileById = async (id: mongoID) => {
    const profile = await Profile.findById(id).exec();
    return profile.toJSON() as UserProfile;
  };

  const currentUser = await Promise.resolve(
    getProfileById(session.user.profileId)
  );
  const participants = await Promise.all(
    conversationDoc.participants.map(getProfileById)
  );

  const rawChatData: Chat = {
    type: "group",
    currentUser: currentUser as UserProfile,
    partner: participants as UserProfile[],
    conversation: conversationDoc.toJSON() as GroupConversation,
  };

  const chatData = JSON.parse(JSON.stringify(rawChatData)) as Chat;

  return <ChatPage chatData={chatData}></ChatPage>;
};

export default page;
