'use client'
import { Check, UserPlus, X } from 'lucide-react'
import { FC, use, useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';


interface FriendRequestsProps {
    incomingFriendRequest: incomingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequest, sessionId}) => {

    const [FriendRequest, setFriendRequest] = useState<incomingFriendRequest[]>(incomingFriendRequest)
    const router = useRouter() 

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );

        const FriendRequestsHandler = ({senderId, senderEmail, senderImage}: incomingFriendRequest) => {
            setFriendRequest((prev) => [...prev, {senderId, senderEmail, senderImage}]);
        }

        pusherClient.bind('incoming_friend_requests', FriendRequestsHandler);

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            );
            pusherClient.unbind('incoming_friend_requests', FriendRequestsHandler)
        }
    }, [sessionId])

    const acceptFriendRequest = async (senderId: string) => {
        await axios.post('/api/friends/accept', {id: senderId})


        //takes the sender request out of the array of the friend requests 
        setFriendRequest((prev)=>{
            return prev.filter((request) => request.senderId !== senderId)
        })

        //refreshes the page to show the new friend
        router.refresh()
    }

    const denyFriendRequest = async (senderId: string) => {
        await axios.post('/api/friends/deny', {id: senderId})


        //takes the sender request out of the array of the friend requests 
        setFriendRequest((prev)=>{
            return prev.filter((request) => request.senderId !== senderId)
        })

        //refreshes the page to show the new friend
        router.refresh()
    }


  return <>
    {
        FriendRequest.length === 0 ? 
        ( <p className='text-sm text-zinc-500'>No friend requests yet...</p> ) :
        ( FriendRequest.map((request) => {
            return(
                <div key={request.senderId} className='flex flex-row gap-4 items-center'>
                    <div className='relative h-8 w-8 bg-gray-50'>
                        <Image
                        fill    
                        referrerPolicy='no-referrer'
                        className='rounded-full'
                        alt='Your profile pricture'
                        src={request.senderImage}
                        />
                    </div>
                    <p className='font-medium text-lg'>{request.senderEmail}</p>
                    <button aria-label='accept friend' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md' onClick={()=>{acceptFriendRequest(request.senderId)}}>
                            <Check 
                            className='font-semibold text-white w-3/4 h-3/4'/>
                    </button>
                    <button aria-label='deny friend' className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'  onClick={()=>{denyFriendRequest(request.senderId)}}>
                        <X 
                        className='font-semibold text-white w-3/4 h-3/4'/>
                    </button>
            </div>
            )
        }) )  
    }
  </>
}

export default FriendRequests