import Image from 'next/image'
import Link from 'next/link'
import FaceIndexer from './components/FaceIndexer'
import Events from './components/Events'

export default function Home() {
  return (
    <main className='bg-white min-h-screen flex flex-col justify-center items-center'>
      <nav>
        <header className='p-3 px-5 text-3xl font-semibold tracking-wider text-gray-900'>
          running <span className='pl-1 text-pink-500'>pictures</span>
        </header>
        <p className='text-center text-lg text-gray-600'>
          Your running legacy, captured forever
        </p>
      </nav>
      <Events />
    </main>
  )
}
