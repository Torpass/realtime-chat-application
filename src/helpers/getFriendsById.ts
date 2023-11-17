import { fecthRedis } from "./redis";

export default async function getFriendsById(userid:string){
    const friendIds = await fecthRedis('smembers', `user:${userid}:friends`) as string[]

    const friends = await Promise.all(
        friendIds.map(async (friendId) => {
            const friend = await fecthRedis('get', `user:${friendId}`) 
            const parsedFriend = JSON.parse(friend) as User
            return parsedFriend
        }
    ))

    return friends
}