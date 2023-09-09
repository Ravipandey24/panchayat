import FriendRequestSection from "@/components/friendRequestSection";
import { authOptions } from "@/lib/auth";
import friendRequest from "@/lib/models/friend-request.model";
import Profile from "@/lib/models/profile.model";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const getProfileByRequest = async (request: FriendRequest) => {
    const profile = await Profile.findById(request.senderId).exec();
    return JSON.parse(JSON.stringify(profile.toJSON())) as UserProfile;
  };

  const allRequests = (await friendRequest.find({
    recieverId: session?.user.profileId,
  })) as FriendRequest[];
  
  const requestedProfiles = await Promise.all(
    allRequests.map(getProfileByRequest)
  );

  // latest request should be on top.
  const sortedRequestedProfiles = requestedProfiles.reverse()
  const userId = JSON.parse(JSON.stringify(session.user.profileId))

  return (
      <FriendRequestSection initialProfiles={sortedRequestedProfiles} userId={userId}></FriendRequestSection>
  );
};

export default page;
