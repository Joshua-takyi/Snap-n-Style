import { SignInAction } from "@/server/action";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        const {email, password} = await req.json();
        const res = await SignInAction({email, password});
        if(res.error){
            return NextResponse.json({message: res.error}, {status: 400});
        }
        return NextResponse.json({message: "Sign-in successful!", data: res}, {status: 200});
    }catch(error){
        return NextResponse.json({message: error.message}, {status: 500});
    }
 }  
