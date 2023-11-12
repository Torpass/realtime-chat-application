import { authOptions } from "@/lib/auth";
import { addFriendSchema } from "@/lib/validations/addFriend";
import { getServerSession } from "next-auth";
import {fecthRedis} from "@/helpers/redis";
import { db } from "@/lib/db";
import {ZodError, z} from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email:emailToAdd } = addFriendSchema.parse(body.email);
        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`, {
            headers:{
                authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            cache: "no-cache"
        });

        const data = await RESTResponse.json() as {result: string};

        const idToAdd = data.result;
        const session = await getServerSession(authOptions);

        if(!idToAdd){
            return new Response("This person does not exist", {status: 400});
        }

        if(!session){
            return new Response("YOU_NEDD_A_SESSION", {status: 401});
        }

        if(idToAdd === session.user.id){
            return new Response("YOU_CANT_ADD_YOURSELF", {status: 400});
        }


        //checkfi user is already added
        const isAlreadyAdded = await fecthRedis(
            "sismember", 
            `user:${idToAdd}:incoming_friend_requests`, 
            session.user.id) as 0 | 1;

        if(isAlreadyAdded){
            return new Response("USER_ALREADY_ADDED", {status: 400});
        }


        //check if user is already friend
        const isAlreadyFriend = await fecthRedis(
            "sismember", 
            `user:${session.user.id}:friends`, 
            idToAdd) as 0 | 1;

        if(isAlreadyFriend){
            return new Response("USER_ALREADY_FRIEND", {status: 400});
        }

        //valid Request send friend request
        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

        return new Response("OK", {status: 200});

    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('IVALID_REQUEST_PAYLOAD', {status: 400});
        }
        
        return new Response('IVALID_REQUEST', {status: 400});
        
    }
}