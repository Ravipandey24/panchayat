import { authOptions } from "@/lib/auth";
import friendRequest from "@/lib/models/friend-request.model";
import Profile from "@/lib/models/profile.model";
import SingleConversation from "@/lib/models/single-conversation.model";
import { connectToDB } from "@/lib/mongodb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const { action, requesterId } =
      (await request.json()) as respondFriendRequest;

    await connectToDB();

    const userProfile = (await Profile.findOne({
      email: session?.user.email,
    })) as UserProfile;
    const requesterProfile = (await Profile.findById(
      requesterId
    )) as UserProfile;

    const hasFriendRequest = (await friendRequest.findOne({
      senderId: requesterId,
      recieverId: session.user.profileId,
    })) as 0 | 1;
    if (!hasFriendRequest) {
      return NextResponse.json(
        { error: "friend request doesn't exists" },
        { status: 400 }
      );
    }

    const alreadyFriends = (userProfile.friends.includes(
      requesterProfile._id
    ) || requesterProfile.friends.includes(userProfile._id)) as boolean;
    if (alreadyFriends) {
      return NextResponse.json(
        { error: "Already friends with this profile" },
        { status: 400 }
      );
    }

    if (action === "accept") {
      // adding both profiles to each other as friends.
      await Profile.findByIdAndUpdate(userProfile._id, {
        friends: [...userProfile.friends, requesterProfile._id],
      });
      await Profile.findByIdAndUpdate(requesterProfile._id, {
        friends: [...requesterProfile.friends, userProfile._id],
      });
      await friendRequest.deleteOne({
        senderId: requesterId,
        recieverId: session.user.profileId,
      });

      // creating a single conversation for the users.
      await SingleConversation.create({ participants: [ requesterProfile._id, userProfile._id ]})
      await pusherServer.trigger(toPusherKey(`friends:${userProfile._id}`), 'new-friend-addition', requesterProfile)

      return NextResponse.json({
        msg: ["Request accepted successfully"],
        success: true,
      });
    }
    if (action === "decline") {
      friendRequest.deleteOne({
        senderId: requesterId,
        recieverId: session.user.profileId,
      });

      return NextResponse.json({
        msg: ["Request declined successfully"],
        success: true,
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ error: errorList }, { status: 500 });
    } else {
      console.log(error);
      return NextResponse.json(
        { error: "Unable to send message." },
        { status: 500 }
      );
    }
  }
}
