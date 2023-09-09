import { authOptions } from "@/lib/auth";
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
