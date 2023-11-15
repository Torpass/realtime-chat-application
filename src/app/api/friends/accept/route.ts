import { fecthRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import {z} from 'zod'

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const {id:idToAccept} = z.object({id: z.string()}).parse(body);

        //checks
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("YOU_NEED_A_SESSION", {status: 401});
        }


        //verify if both users are already friends
        const isAlreadyFriend = await fecthRedis(
            "sismember",
            `user:${session.user.id}:friends`,
            idToAccept
        )as 0 | 1;
        if(isAlreadyFriend){
            return new Response("USER_ALREADY_FRIEND", {status: 400});
        }


        //verify if the user has a friend request from the user
        const hasFriendRequest = await fecthRedis(
            "sismember",
            `user:${session.user.id}:incoming_friend_requests`,
            idToAccept
        ) as 0 | 1;
        if(!hasFriendRequest){
            return new Response("NO_FRIEND_REQUEST", {status: 400});
        }


        //accept the friend request
        await db.sadd(`user:${session.user.id}:friends`, idToAccept);
        await db.sadd(`user:${idToAccept}:friends`, session.user.id);

        //remove the friend request
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAccept);
        // create like a outlog of the friend request
        // await db.srem(`user:${idToAccept}:outlog_friend_requests`, session.user.id);


        console.log('you are here, well done')
        return new Response("OK");

    }catch(error:any){
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 })
        }
      
        return new Response('Invalid request', { status: 400 })
    }
}