'use client'

import { signOut } from 'next-auth/react'
import { FC } from 'react'

interface LogOutButtonProps {
  
}

const LogOutButton: FC<LogOutButtonProps> = ({}) => {
  return  <button onClick={()=>{signOut()}}>Log out</button>
}

export default LogOutButton