import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ChatPage from "@/components/chatpage/page";
import { notFound } from "next/navigation";
import Profile from "@/lib/models/profile.model";
import SingleConversation from "@/lib/models/single-conversation.model";


const page = async ({ params }: { params: { username: string } }) => {
  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const friendProfile = await Profile.findOne({username: params.username}) 
  const currentUser = await Profile.findById(session.user.profileId) 
  if(!friendProfile) notFound()

  const conversationDoc = await SingleConversation.findOne({ participants: { $all: [ session.user.profileId, friendProfile._id ] } })
  if(!conversationDoc) notFound()
  
  const rawChatData: Chat = {
    type: 'single',
    currentUser: currentUser.toJSON() as UserProfile,
    partner: friendProfile as UserProfile,
    conversation: conversationDoc.toJSON() as Conversation
  }

  const chatData = JSON.parse(JSON.stringify(rawChatData)) as Chat;
  
  // const isConversationInitiator = await SingleConversation.findOne({ initiatorId: session.user.profileId, responderId: friendProfile._id }) 
  // const isConversationRespondant = await SingleConversation.findOne({ initiatorId: friendProfile._id, responderId: session.user.profileId }) 
  // let conversationData = {}

  // if( !isConversationInitiator && !isConversationRespondant ) notFound()
  // if(isConversationInitiator) {
  //   conversationData = { initiator: true, conversation: isConversationInitiator } 
  // }
  // if(isConversationRespondant) {
  //   conversationData = { initiator: false, conversation: isConversationRespondant }
  // }

  // console.log(conversationData);
  

  return (
    <ChatPage chatData={chatData} ></ChatPage>
  );
};

export default page;
