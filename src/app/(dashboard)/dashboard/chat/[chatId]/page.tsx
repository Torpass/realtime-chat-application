import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { fecthRedis } from '@/helpers/redis';
import { FC } from 'react'
import { messageSchema } from '@/lib/validations/messages';

interface pageProps {
  params: {
    chatId:string,

  }
}

const getMessages = async (chatId:string) => {
  try {
      const results:string[] = await fecthRedis(
        'zrange',
        `chat:${chatId}:messages`,
        0,
        -1
      );

      const dbMessages = results.map((message) => JSON.parse(message) as Message);
      const reversedMessages = dbMessages.reverse();

      const messages = messageSchema.parse(reversedMessages);

      return messages;
  } catch (error) {
    
  }
}

const page = async ({params}: pageProps) => {
  const {chatId} = params;

  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const {user} = session;

  const [userId1, userId2] = chatId.split('--')
  if(user.id !== userId1 && user.id !== userId2) notFound()

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartner = await (db.get(`user:${chatPartnerId}`)) as User



  return <div>{params.chatId}</div>
}

export default page