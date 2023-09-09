import { authOptions } from "@/lib/auth";
import GroupConversation from "@/lib/models/group-conversation.model";
import SingleConversation from "@/lib/models/single-conversation.model";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { messageValidator } from "@/lib/validations/client-vals";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      conversationId,
      conversationType,
      senderId,
      text,
    }: z.infer<typeof messageValidator> = messageValidator.parse(body);

    // check wheather sender is a part of the session.
    if( !session.user.profileId.equals(senderId) ){
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (conversationType === "single") {
      const Conversation = (await SingleConversation.findById(
        conversationId
      )) as Conversation;
      
      if (!Conversation.participants.includes(senderId)) {
        return NextResponse.json(
          { error: "you are not a part of this conversation!" },
          { status: 401 }
        );
      }

      const message = { senderId, text }      

      // adding message ot database
      const updatedConversation = await SingleConversation.findByIdAndUpdate(Conversation._id, { messages: [ ...Conversation.messages, message ] }, { returnDocument: "after" }) as Conversation
      const recentMessage = updatedConversation.messages[updatedConversation.messages.length -1] as Message
      
      //pushing message in single conversation pusher
      await pusherServer.trigger(toPusherKey(`single_conversation:${Conversation._id}`), 'incoming-message', recentMessage)

      return NextResponse.json({
        msg: ["message sent successfully"],
        success: true,
      });
    } else if (conversationType === "group") {
      const Conversation = (await GroupConversation.findById(
        conversationId
      )) as Conversation;
      
      if (!Conversation.participants.includes(senderId)) {
        return NextResponse.json(
          { error: "you are not a part of this conversation!" },
          { status: 401 }
        );
      }

      const message = { senderId, text }

      // adding message ot database
      const updatedConversation = await GroupConversation.findByIdAndUpdate(Conversation._id, { messages: [ ...Conversation.messages, message ] }, { returnDocument: "after" }) as Conversation
      const recentMessage = updatedConversation.messages[updatedConversation.messages.length -1] as Message

      //pushing message in group conversation pusher
      await pusherServer.trigger(toPusherKey(`group_conversation:${Conversation._id}`), 'incoming-message', recentMessage)
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
