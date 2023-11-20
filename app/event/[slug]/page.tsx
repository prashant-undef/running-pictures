'use client'

import { handleImageUpload } from '@/app/utils'
import React, { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'

const fetcher = async (url: string, event_slug: string) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_slug,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.json()
    })
    .catch((error) => {
      throw new Error(`Fetch error: ${error.message}`)
    })
}

const fetchSimilarImages = async (url: string, image_url: string) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }
      return res.json()
    })
    .catch((error) => {
      throw new Error(`Fetch error: ${error.message}`)
    })
}
const page = ({ params }: { params: { slug: string } }) => {
  // const router = useRouter()

  const [faceToFind, setFaceToFind] = useState('')
  // const [foundImages, setFoundImages] = useState([])

  const { slug } = params
  const { data, error, isLoading } = useSWR(
    ['/api/getSingleEvent', slug],
    ([url, event_slug]) => fetcher(url, event_slug)
  )

  const { data: result, isLoading: findingImages } = useSWR(
    faceToFind ? ['/api/searchFacesByImage', faceToFind] : null,
    ([url, image_url]) => fetchSimilarImages(url, image_url)
  )

  if (error) return <div>Failed to load {error.message}</div>
  if (!data || isLoading) return <div>Loading...</div>

  const { name, id, city, date, featuredImageURL } = data

  return (
    <main className='h-screen p-5 lg:mx-64 2xl:mx-96'>
      <nav className='flex border-2 border-black bg-white'>
        <aside className='relative flex flex-col items-end justify-end border-r-2 border-black p-3 px-5 text-lg font-bold lowercase text-pink-500'>
          r <span className='absolute pl-1 text-xs text-black'>_</span>
        </aside>
        <a href='/'>
          <header className='p-3 px-5 text-lg font-semibold tracking-wider text-gray-900'>
            running<span className='pl-1 text-pink-500'>pictures</span>
          </header>
        </a>
      </nav>
      {!result ? (
        <article className='w-full'>
          {!findingImages ? (
            <>
              {' '}
              <section className='mt-4 overflow-hidden border-2 border-black'>
                <Image
                  alt='event-poster'
                  loading='lazy'
                  width='600'
                  height='300'
                  decoding='async'
                  data-nimg='1'
                  className='h-36 w-full object-cover object-center'
                  src={featuredImageURL}
                />
              </section>
              <section className='mt-0 border-2 border-t-0 border-black p-3 px-5'>
                <h1 className='text-base font-bold'>{name}</h1>
                <div className='text-md mt-1 flex gap-x-3'>
                  <p>{city}</p>
                  <p>{date}</p>
                </div>
              </section>
              <input
                id='image'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={async (event) => {
                  if (event?.target?.files && event?.target?.files.length > 0)
                    setFaceToFind(
                      await handleImageUpload(event?.target?.files[0])
                    )
                }}
              />
              <label htmlFor='image' className='cursor-pointer'>
                <section className='mt-4 flex flex-col items-center justify-between overflow-hidden border-2 border-black py-2'>
                  <div className='py-3'>
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      viewBox='0 0 1024 1024'
                      height='64'
                      width='64'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M864 248H728l-32.4-90.8a32.07 32.07 0 0 0-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80zm8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456zM512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z'></path>
                    </svg>
                  </div>
                  <div className='flex h-full flex-col justify-center py-2 text-center'>
                    <h1 className='pb-2 text-xl font-bold'>Search By Image </h1>
                    <p className='text-md px-14 leading-4'>
                      Upload a picture to search
                    </p>
                  </div>
                </section>
              </label>
            </>
          ) : (
            <Skeleton count={3} height={200} className='my-2' />
          )}
        </article>
      ) : (
        <>
          <section className='mt-0 border-2 border-t-0 border-black p-3 px-5'>
            <h1 className='text-base font-bold'>{name}</h1>
            <div className='text-md mt-1 flex gap-x-3'>
              <p>{city}</p>
              <p>{date}</p>
            </div>
          </section>

          <section className='mt-3 grid grid-cols-2 gap-3 xl:grid-cols-3'>
            {result.images.map((image) => (
              <>
                <div className='relative border-2 border-black mb-5'>
                  <Image
                    alt='image'
                    loading='lazy'
                    width='400'
                    height='400'
                    decoding='async'
                    className='z-10 col-span-1 row-span-1 aspect-square h-full w-full object-cover transition hover:scale-125'
                    src={image}
                  />
                  {/* <h3>{image[1]}</h3> */}
                </div>
              </>
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default page
