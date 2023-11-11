import Image from 'next/image'
import Button from '@/components/UI/Button'
import { db } from '@/lib/db'

export default async function Home() {

  return (
    <main>
      <h1 className='text-bold text-4xl text-red-900'>Holiwis</h1>
      <Button>Holiwis</Button>

    </main>
  )
}
