'use client'

import { FC, useRef, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import Button from './UI/Button'
import axios from 'axios'
import toast from 'react-hot-toast'

interface MessageInputProps {
    chatPartner: User,
    chatId:string
}

const MessageInput: FC<MessageInputProps> = ({chatPartner, chatId}) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const sendMessageFunction = async () => {
      if(!input) return
        setIsLoading(true)
        try {
            await axios.post('/api/messages/send', {text:input, chatId})
            setInput('')
            textAreaRef.current?.focus()
        } catch (error:any) {
            toast.error('Something went wrong. Please try again.')
        }finally{
            setIsLoading(false);
        }
    }
    const [input, setInput] = useState<string>('')

  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 '>
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
            <TextAreaAutosize 
            ref={textAreaRef}
            onKeyDown={(event) => {
                if(event.key === 'Enter' && !event.shiftKey){
                    event.preventDefault()
                    sendMessageFunction()
                }
            }}
            rows ={1}
            value={input}
            onChange={(event) => {setInput(event.target.value)}}
            placeholder={`Message ${chatPartner.name}`}
            className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
            />

        <div
          onClick={() => textAreaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'>
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrin-0'>
            <Button isLoading={isLoading} onClick={sendMessageFunction} type='submit'>
              send
            </Button>
          </div>
        </div>

        </div>
    </div>
  )
}

export default MessageInput