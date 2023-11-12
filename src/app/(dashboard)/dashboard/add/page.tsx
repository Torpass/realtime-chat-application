import AddFriendButton from '@/components/AddFriendButton'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

const page: FC = () => {
  

  return <main className='pt-8'>
    <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <AddFriendButton/>
  </main>
}

export default page