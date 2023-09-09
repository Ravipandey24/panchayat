import { connectToDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import friendRequest from "@/lib/models/friend-request.model";
import { addFriendValidator } from "@/lib/validations/client-vals";
import Profile from "@/lib/models/profile.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if(!session) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json();
    await connectToDB();

    const { query } = addFriendValidator.parse(body.query);
    //  friendRequest.create({ senderId: 'some', recieverId: 'some' })
    
    const senderProfile = await ( Profile.findOne({ email: session?.user.email }) ) as UserProfile
    const recieverProfile = await ( Profile.findOne({ $or: [ { email: query }, { username: query } ] }) ) as UserProfile

    if(!recieverProfile) {
      return NextResponse.json(
        { error: "username or email doesn't exists!" },
        { status: 400 }
      )
    }

    const sendingRequestToSelf = (senderProfile._id).equals(recieverProfile._id) as 0 | 1
    if (sendingRequestToSelf) {
      return NextResponse.json(
        { error: "You cannot add yoourself as friend" },
        { status: 400 }
      )
    }

    const alreadyFriends = (senderProfile.friends.includes(recieverProfile._id) || recieverProfile.friends.includes(senderProfile._id)) as boolean
    if(alreadyFriends){
      return NextResponse.json(
        { error: "Already friends with this profile" },
        { status: 400 }
      )
    }

    const requestAlreadyExist = await friendRequest.findOne({senderId: senderProfile._id, recieverId: recieverProfile._id}) as 0 | 1 || await friendRequest.findOne({senderId: recieverProfile._id, recieverId:  senderProfile._id}) as 0 | 1
    if(requestAlreadyExist){
      return NextResponse.json(
        { error: "Request already exists" },
        { status: 400 }
      )
    }

    const requestObj = {
      senderId: senderProfile._id, 
      recieverId: recieverProfile._id
    }
    await friendRequest.create(requestObj)
    await pusherServer.trigger(toPusherKey(`friend_request:${recieverProfile._id}`), 'incoming-friend-request', senderProfile)

    return NextResponse.json({
      msg: "Request sent successfully",
      success: true,
    });

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ error: errorList }, { status: 500 });
    } else {
      console.log(error)
      return NextResponse.json({ error: "Unable to send request."}, { status: 500 });
    }
  }
}
