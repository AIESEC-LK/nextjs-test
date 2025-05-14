import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/prisma/client";
import { createIssueSchema } from "../../ValidationSchemas";


export async function POST(request: NextRequest){
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json(validation.error.format(),{status:400})

    }


   try {
       const newIssue = await prisma.issue.create({
           data: {
               title: body.title,
               description: body.description
           }
       });
       return NextResponse.json(newIssue, { status: 201 });
   } catch (error: unknown) {
       return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
   }


}

