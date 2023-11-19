'use client'

import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import Image from 'next/image';
import { pusherClient } from '@/lib/pusher';
import toast from 'react-hot-toast';
import UnseenChatToast from './unseenChatToast';

interface SideBarChatListProps {
    friends: User[]
    sessionId:string
}

interface ExtendedMessage extends Message{
    senderName: string
    senderImg: string

}

const SideBarChatList: FC<SideBarChatListProps> = ({friends, sessionId}) => {
    const router = useRouter();
    const pathName = usePathname();

    const [unseenMessages, setunseenMessages] = useState<Message[]>([])

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = (data: any) => {
            router.refresh
        }

        const chatHandler = (message: ExtendedMessage) => {
            const sameChat = pathName !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

            if(!sameChat) return

            console.log(message.senderImg)
            toast.custom((t) =>(
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderName={message.senderName}
                    senderMessage={message.text}
                />    
            ))
            setunseenMessages((prev) => [...prev, message])
        }

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)


        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
        }
    }, [pathName, sessionId, router])

    useEffect(() => {
        if(pathName?.includes('chat')){
            setunseenMessages((prev)=>{
                return prev?.filter((msg)=> !pathName.includes(msg.senderId))
            })
        }
    }, [pathName])
  return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1 '>
            {
                friends.sort().map((friend) =>{   
                    const unseenMessagesCount = unseenMessages.filter((unseenMsg) =>{
                        return unseenMsg.senderId === friend.id
                    }).length

                    console.log(sessionId, friend.id)
                    return (
                        <li key={friend.id}>
                            <a href={`/dashboard/chat/${chatHrefConstructor(
                                sessionId,
                                friend.id
                            )}`} 
                            className='relative text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center rouded-md p-2 text-sm gap-x-3 leading-6 font-semibold'>
                                <Image
                                    width={30}
                                    height={30}    
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    alt={`Profile picture of ${friend.name}`}
                                    src={friend.image}
                                />
                                {friend.name}
                                {
                                    unseenMessagesCount > 0 ? (
                                        <div className='rounded-full w-4 h-4 text-xs flex justify-center items-center text-white font-medium bg-indigo-600'>{unseenMessagesCount}</div>
                                    ): null
                                }
                                </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default SideBarChatList