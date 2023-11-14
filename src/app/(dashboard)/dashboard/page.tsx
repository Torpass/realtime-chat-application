
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import LogOutButton from '@/components/UI/LogOutButton'


const page = async ({}) => {
  const session = await getServerSession(authOptions)
  console.log(session)

  return(<>
      <h1>Dashboard</h1>
      <p>You are loggued as </p>

      <LogOutButton />
    </>

  ) 
}

export default page