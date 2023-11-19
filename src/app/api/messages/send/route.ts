import { fecthRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, messageSchema } from "@/lib/validations/messages";
import { timeStamp } from "console";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function POST(req: Request, res: Response) {
    try {
        const {text, chatId}: {text:string, chatId:string} = await req.json();

        //validations
        const session = await getServerSession(authOptions);
        if(!session){
            throw new Response("Not authenticated", {status: 401});
        }
        const [user1, user2] = chatId.split("--");

        if(session.user.id !== user1 && session.user.id !== user2){
            throw new Response("Not authorized", {status: 403});
        }

        const friendId = session.user.id === user1 ? user2 : user1;

        const friendList = await fecthRedis('smembers', `user:${session.user.id}:friends`) as string[];
        const isFriend = friendList.includes(friendId);
        if(!isFriend){
            throw new Response("Not authorized", {status: 403});
        }

        const rawSender = await fecthRedis('get', `user:${session.user.id}`) as string;
        const sender = JSON.parse(rawSender) as User;

        const messageData:Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timeStamp: Date.now()
        }

        const message = messageSchema.parse(messageData);

        //notify friends conneced to the chat room
        pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message);


        pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
            ...message,
            senderImg: sender.image,
            senderName: sender.name,
        })


        //send message
        await db.zadd(`chat:${chatId}:messages`, {
            score: Date.now(),
            member: JSON.stringify(message)
        })

        return new Response('ok', {status:200}) 
    } catch (error:any) {
        if(error instanceof Error){
            return new Response(error.message, {status: 400});
        }

        return new Response('Internal server error', {status: 500});
    }
}
