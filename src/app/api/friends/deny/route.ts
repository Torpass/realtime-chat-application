import { fecthRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {id:idToDeny} = z.object({id: z.string()}).parse(body);

        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("YOU_NEED_A_SESSION", {status: 401});
        }
        

        //verify if the user has a friend request from the user
        const hasFriendRequest = await fecthRedis(
            "sismember",
            `user:${session.user.id}:incoming_friend_requests`,
            idToDeny
        ) as 0 | 1;

        if(!hasFriendRequest){
            return new Response("NO_FRIEND_REQUEST", {status: 400});
        }

        //remove the friend request
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

        return new Response("OK");
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }
      
        return new Response('Invalid request', { status: 400 })
    }
}