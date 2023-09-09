import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import clientPromise, { connectToDB } from "./mongodb";
import Google from "next-auth/providers/google";
import { ObjectId } from "mongodb";
import Profile from "./models/profile.model";
import mongoose from "mongoose";
import { generateRandomUsername } from "./generators";
import GroupConversation from "./models/group-conversation.model";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

// const MongoDBAdapterOptions = {
//   databaseName: "panchayat",
// };

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<any> {
      // return token

      const client = await clientPromise;
      const db = client.db();

      const object_id: any = new ObjectId(token.tokenId);
      const dbUser = await db.collection("users").findOne({ _id: object_id });

      if (!dbUser) {
        if (user) {
          token.tokenId = user!.id;
        }
        return token;
      }

      return {
        tokenId: dbUser["_id"],
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      await connectToDB();
      const userProfle = await Profile.findOne({ email: token.email });

      if (token) {
        (session.user.id = token.tokenId),
          (session.user.name = token.name),
          (session.user.email = token.email),
          (session.user.image = token.picture);
        if (userProfle) session.user.profileId = userProfle._id;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        await connectToDB();

        // creating profile document if not already exists.
        const username = generateRandomUsername(user.name);
        let userProfle = await Profile.findOne({ email: user.email });
        if (userProfle) {
          console.log("Profile exists");
        } else {
          userProfle = await Profile.create({
            username,
            name: user.name,
            image: user.image,
            email: user.email,
          });
        }

        // adding profileId to general spot group.
        await GroupConversation.updateOne(
          { _id: new ObjectId("64fc4832650ba2d5385f74ad") },
          { $addToSet: { participants: userProfle._id } }
        );

        return true;
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          let errorList = [];
          for (let e in error.errors) {
            errorList.push(error.errors[e].message);
          }
          console.log(errorList);
        } else {
          console.log(error);
        }
        return "/login";
      }
    },
    redirect() {
      return "/dashboard";
    },
  },
};
