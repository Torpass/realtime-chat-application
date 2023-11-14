import FriendRequests from '@/components/FriendRequests'
import { fecthRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  
}

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) return notFound()

    //ids of people who sent current logged in user a friend request
    const incommingSendersIds = 
    await fecthRedis(
        'smembers',
        `user:${session.user.id}:incoming_friend_requests`
    ) as string[]

    //get the user data of the people who sent the friend request
    const incommingSenders =
    await Promise.all(
         incommingSendersIds.map(async (senderId) =>{
            const sender = JSON.parse(await fecthRedis('get', `user:${senderId}`)) as User

            return {
                senderId,
                senderEmail: sender.email,  
                senderImage: sender.image
            }
         })
    )

  return (
    <main className='pt-8 '>
        <h1 className='font-bold text-5xl mb-8'>Friends Request</h1>
        <div className='flex flex-col gap-4'>
            <FriendRequests 
            incomingFriendRequest={incommingSenders}
            sessionId={session.user.id}
            />
        </div>
    </main>
  ) 
}

export default page