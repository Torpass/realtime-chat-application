'use client'
import { FC, useState } from 'react'
import Button from './UI/Button'
import { addFriendSchema } from '@/lib/validations/addFriend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface AddFriendButtonProps {
  
}

type FormData = z.infer<typeof addFriendSchema>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

    const { register, handleSubmit, setError, formState:{errors} } = useForm<FormData>({
        resolver: zodResolver(addFriendSchema)
    })
    
    const addFriend = async (email:string) =>{
        try{
            const validatedEmail = addFriendSchema.parse({email})

            await axios.post('/api/friends/add', {
                email: validatedEmail
            })

            setShowSuccessState(true)
        }catch(error:any){
            if(error instanceof z.ZodError){
                setError('email', {
                    message: error.message
                })
                return
            }
            if (error instanceof AxiosError){
                setError('email', {
                    message: error.response?.data
                })
                return
            }
            setError('email', {
                message: 'An unknown error occurred'
            })
        }
    }                        
    
    const onSubmit = (data:FormData) => {
        addFriend(data.email)
    }


  return <form className='max-w-sm' onSubmit={handleSubmit(onSubmit)}>
    <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>
        Add a friend by email
    </label>

    <div className='mt-2 flex gap-4'>
        <input 
        {...register('email')}
        type="text"  
        className='block w-full rounded-md border-0 py-1.2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-offset-indigo-600 sm:text-sm sm:leading-6'
        placeholder='you@example.com'
        />
        <Button>Add</Button>
    </div>
    <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
    {showSuccessState && <p className='mt-1 text-sm text-green-600'>Friend request send  successfully!</p>}
  </form>
}

export default AddFriendButton