'use client'
import { Check, UserPlus, X } from 'lucide-react'
import { FC, useState } from 'react'
import Image from 'next/image';


interface FriendRequestsProps {
    incomingFriendRequest: incomingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequest}) => {

    const [FriendRequest, setFriendRequest] = useState<incomingFriendRequest[]>(incomingFriendRequest)


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
                    <button aria-label='accept friend' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <Check 
                            className='font-semibold text-white w-3/4 h-3/4'/>
                    </button>
                    <button aria-label='deny friend' className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
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