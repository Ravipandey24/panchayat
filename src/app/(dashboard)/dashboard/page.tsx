import AddFriendButton from "@/components/addFriendButton";
import { Button } from "@/components/ui/button";
import { List } from "@/components/ui/list";
import { authOptions } from "@/lib/auth";
import friendRequest from "@/lib/models/friend-request.model";
import Profile from "@/lib/models/profile.model";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import PendingRequestButton from "@/components/pendingRequestButton";
import FriendListSection from "@/components/friendListSection";
import GroupConversation from "@/lib/models/group-conversation.model";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const getProfileById = async (id: mongoID) => {
    const profile = await Profile.findById(id).exec();
    return profile.toJSON() as UserProfile;
  };

  const userProfile = await Promise.resolve(
    getProfileById(session.user.profileId)
  );
  const rawUserFriends = await Promise.all(
    userProfile.friends.map(getProfileById)
  );
  const userFriends = JSON.parse(JSON.stringify(rawUserFriends.reverse()));

  const newFriendRequests = (await friendRequest.find({
    recieverId: session.user.profileId,
    seen: false,
  })) as FriendRequest[];
  const requestCount = newFriendRequests.length;
  const userId = JSON.parse(JSON.stringify(session.user.profileId));

  return (
    <div className="w-full p-2 space-y-2">
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <AddFriendButton></AddFriendButton>
        <PendingRequestButton
          userId={userId}
          requestCount={requestCount}
        ></PendingRequestButton>
      </div>
      <FriendListSection
        initialFriendList={userFriends}
        userId={userId}
      ></FriendListSection>
    </div>
  );
};

export default page;
