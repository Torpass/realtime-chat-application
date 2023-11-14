'use client'

import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from 'react'
import { FC } from 'react'
import Button from './Button'
import toast from 'react-hot-toast'
import { set } from 'zod'
import { Loader2, LogOut } from 'lucide-react'

interface LogOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const handleSignOut = async (setSigninOut: Dispatch<SetStateAction<boolean>>) => {
  try {
    setSigninOut(true)
    await signOut()
  } catch (error) {
    toast.error('there was an error signin out')
    setSigninOut(false)
  } finally{
    setSigninOut(false)

  }
}

const LogOutButton: FC<LogOutButtonProps> = ({...props}) => {
  const [isSignin, setisSigninOut] = useState<boolean>(false)

  return( 
    <Button 
      {...props}
      variant='ghost'
      onClick={async ()=>{
        await handleSignOut(setisSigninOut);
      }}>
      {
        isSignin ? 
        (<Loader2 className='animate-spin h-4 w-4'></Loader2>) : 
        (<LogOut className='w-4 h-4 '> </LogOut>) 
      }  
    </Button>
  )
}

export default LogOutButton