'use client'

import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

const Events = () => {
  const { data, error, isLoading } = useSWR('/api/getEvents', fetcher)

  console.log(data)

  if (error) return <div>Failed to load</div>
  if (!data || isLoading) return <div>Loading...</div>

  return (
    <section className='mt-20 rounded-xl border border-gray-200 bg-slate-50 px-20 py-14'>
      <h3 className='pb-4 text-lg font-light text-gray-600'>Recent Events</h3>
      <section className='flex flex-col gap-y-2'>
        {data?.map((event: any) => (
          <Link href={`/event/${event.slug}`} className='text-black'>
            <article className='flex cursor-pointer items-center gap-x-3 text-sm hover:underline'>
              <svg
                stroke='currentColor'
                fill='currentColor'
                strokeWidth='0'
                viewBox='0 0 448 512'
                className='text-gray-600'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z'></path>
              </svg>
              {event.name}
            </article>
          </Link>
        ))}
      </section>
    </section>
  )
}

export default Events
