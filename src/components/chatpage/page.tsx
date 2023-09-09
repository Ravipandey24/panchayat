import GroupChatSection from "./group-chat-section";
import InputSection from "./input-section";
import SingleChatSection from "./single-chat-section";

const ChatPage = ({ chatData }: { chatData: Chat }) => {
  return (
    <>
      {chatData.type === "single" ? (
        <SingleChatSection
          initialMessages={chatData.conversation.messages.reverse()}
          conversationId={chatData.conversation._id}
          partner={chatData.partner as UserProfile}
          currentUser={chatData.currentUser}
        ></SingleChatSection>
      ) : chatData.type === "group" ? (
        <GroupChatSection
          title={(chatData.conversation as GroupConversation).name}
          conversationId={chatData.conversation._id}
          currentUser={chatData.currentUser}
          participants={chatData.partner as UserProfile[]}
          admins={(chatData.conversation as GroupConversation).admins}
          initialMessages={chatData.conversation.messages}
        ></GroupChatSection>
      ) : null}
      <div className="inset-x-0 bottom-0 ">
        <div className="mx-auto sm:max-w-2xl sm:px-4 space-y-4 border-t px-4 py-2 shadow-sm sm:rounded-t-xl sm:border md:py-4">
          <InputSection chatData={chatData}></InputSection>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
