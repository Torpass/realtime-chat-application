import { chatHrefConstructor, cn } from '@/lib/utils'
import { FC } from 'react'
import toast, { Toast } from 'react-hot-toast'
import Image from 'next/image'


interface unseenChatToastProps {
    t:Toast
    sessionId:string
    senderId:string
    senderImg: string
    senderName: string
    senderMessage: string
  
}

const UnseenChatToast: FC<unseenChatToastProps> = ({t, sessionId, senderId, senderImg, senderName, senderMessage}) => {
  return (
    <div
    className={cn('max-w-md w-full bg-white rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5', {
    'animate-enter': t.visible,
    'animate-leave': !t.visible,
    })}>
        <a onClick={()=>toast.dismiss(t.id)} href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className='flex-1 w-0 p-4'>
            <div className='flex items-start'>
                <div className='flex-shrink-0 pt-0.5'>
                    <div className='relative w-10 h-10'>
                        <Image 
                        fill
                        referrerPolicy='no-referrer'
                        className='rounded-full'
                        alt={`${senderName} profile picture`}
                        src={senderImg}
                        />
                    </div>
                </div>

                <div className='ml-3 flex-1'>
                    <p className='text-sm font-medium text-gray-900'>{senderName}</p>
                    <p className='mt-1 text-sm text-gray-600'>{senderMessage}</p>
                </div>
            </div>
        </a>

        <div className='flex border-1 border-gray-200'>
            <button onClick={()=>toast.dismiss(t.id)}
            className='w-full border border-transparent rounded-none rounded-r-lg p-4 items-center justify-center text-sm font-medium  text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-indigo-500 '>
                Close
            </button>   
        </div>
    </div>
    )
}

export default UnseenChatToast