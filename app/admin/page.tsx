import Image from 'next/image'
import Link from 'next/link'
import FaceIndexer from '../components/FaceIndexer'

export default function Home() {
  return (
    <main className='bg-white min-h-screen flex flex-col justify-center items-center'>
      <FaceIndexer />
    </main>
  )
}
