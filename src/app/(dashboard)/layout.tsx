import { Icon, Icons } from '@/components/Icons';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import LogOutButton from '@/components/UI/LogOutButton'
import { FC, ReactNode } from 'react'
import FriendRequestSideBarOption from '@/components/FriendRequestSideBarOption';
import { fecthRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';

interface layoutProps {
    children: ReactNode
  
}

interface SidebarOption{
    id:number,
    name:string,
    href:string,
    Icon: Icon
}

const sideBardOptions:SidebarOption[] = [
        {
            id: 1,
            name: 'Add friends',
            href: '/dashboard/add',
            Icon: 'UserPlus'
        },

]


const  layout = async ({children}: layoutProps) => {
    const session = await getServerSession(authOptions);
    if(!session) notFound()


    const unseenRequestsCount = 
        await fecthRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
            ) as User[]
    
    const totalUnseenRequestCount = unseenRequestsCount.length

        
        

    return (
        <div className='w-full flex h-screen '>
            <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link 
                    href='/dashboard' 
                    className='flex h-16 shrink-0 items-center'>
                    <Icons.Logo 
                        className='h-8 w-auto text-indigo-600'/>
                </Link>

                <div className='text-xs font-semibold leading-6 text-gray-600'>
                    Your chats
                </div>

                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                            //chats that this user have
                        </li>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>

                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {
                                    sideBardOptions.map((option) =>{
                                        const Icon = Icons[option.Icon]
                                        return (
                                            <li key={option.id}>
                                                <Link href={option.href} 
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                                     <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                        <Icon className='h-4 w-4'></Icon>
                                                    </span>

                                                    <span className='truncate'>{option.name}</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>

                        <li>
                            <FriendRequestSideBarOption
                            sessioId={session.user.id}
                            initialUnseenRequestsCount={totalUnseenRequestCount}
                            />
                        </li>

                        <li className='-mx-6 mt-auto flex items-center'>
                            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill    
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        alt='Your profile pricture'
                                        src={session.user.image || ''}
                                    />
                                    </div>
                                    <span className='sr-only'>Your profile</span>
                                    <div className='flex flex-col'>
                                        <span aria-hidden='true'>{session.user.name}</span>
                                        <span aria-hidden='true'  className='text-xs text-zinc-400'>{session.user.email}</span>
                                </div>
                            </div>  
                            <LogOutButton />
                        </li>
                    </ul>
                </nav>
            </div>
                {children}
        </div>
    )
}

export default layout