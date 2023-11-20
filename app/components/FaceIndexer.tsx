'use client'

import React, { useEffect, useState } from 'react'
import { handleImageUpload } from '../utils'

// const URLS = [
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(1).jpg?alt=media&token=4b854374-2dac-446a-8053-289cf78375c8',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(3).jpg?alt=media&token=05782efb-5476-48f1-b6d7-29d8ec34ee88',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2139.jpg?alt=media&token=e9eb23d8-0f2c-46ce-912e-724d9d98ab2e',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(1).jpg?alt=media&token=73759f81-65f0-40b0-a1c5-fc83586d2619',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(3).jpg?alt=media&token=8e285efc-a0b3-4c35-9b8f-88d506fce066',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(4).jpg?alt=media&token=a05ce09b-2088-4d00-a332-5a623376fda7',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(5).jpg?alt=media&token=ee29960b-b65b-4fa4-be13-b257656c18cc',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(6).jpg?alt=media&token=d50acf44-bcfd-469a-a7aa-8d8ed9260cd7',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-2153.jpg?alt=media&token=7ccb42bc-6f23-4dfc-a9b4-7a3aafcd3e7c',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-3085%20(1).jpg?alt=media&token=1cbbde50-2fa6-49de-9789-fe2c226f2c7e',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-3085%20(2).jpg?alt=media&token=aa4c07fd-d9d2-4440-bf0d-f926de30308a',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-3085.jpg?alt=media&token=5fc6fe45-2a54-4aaf-ba35-c2a5998e4230',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-3089%20(1).jpg?alt=media&token=f75139d4-6e66-4a91-a24f-a9f00543bd76',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Pune-Hill-Half-Marathon-3089%20(4).jpg?alt=media&token=77d360c3-9fa9-4d3b-a0f5-01ebb5516506',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Runathon-of-Hope-2315%20(5).jpg?alt=media&token=0220953c-f469-49b8-92f4-2a67f0eb53da',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Runathon-of-Hope-2315%20(6).jpg?alt=media&token=a428d073-df75-4c81-952d-0d5b66290302',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Runathon-of-Hope-bib%20(1).jpg?alt=media&token=9626bcc1-98a2-4153-ac33-efd1e6decaae',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Runathon-of-Hope-bib%20(2).jpg?alt=media&token=2bf83456-ae24-4f1d-bec8-ec48b5dfc07b',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Runathon-of-Hope-bib.jpg?alt=media&token=3a9bf67e-16a5-4020-af34-456f3ed5e686',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363%20(3).jpg?alt=media&token=0ca469a2-3a46-451a-9e38-97faf1e27692',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363%20(4).jpg?alt=media&token=cf767d2a-e4cb-4a0e-9274-c1fdbafb98c2',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363%20(5).jpg?alt=media&token=ece2c6ec-0c8b-49a8-9ca2-5cd4515c0360',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363%20(7).jpg?alt=media&token=0be6cc2a-38f2-406a-b438-b49e2ad62704',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363%20(8).jpg?alt=media&token=1ab82e8b-b79e-4d85-bdbe-9af158aa3eab',
//   'https://firebasestorage.googleapis.com/v0/b/running-picture-s.appspot.com/o/Sinhagad-Marathon-2023-1363.jpg?alt=media&token=c7f4168e-ee91-4459-94a3-fc81da2c4487',
// ]

const URLS2 = [
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(1).jpg?alt=media&token=660ee238-ec4d-49e5-9f6f-2da6e89749f1',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(2).jpg?alt=media&token=5b7cb7da-1c41-4499-8e09-deaf0ac2a505',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(3).jpg?alt=media&token=fc7ea1df-2443-4303-8d10-b3adba5d8098',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2139%20(4).jpg?alt=media&token=f64a1550-9827-4349-817c-b6daae89298d',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2139.jpg?alt=media&token=8b871164-11a1-4f6c-8577-655483f9d910',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(1).jpg?alt=media&token=5b5eacbd-7846-4ab8-b09e-c25d74e85070',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(2).jpg?alt=media&token=ab1bec58-2975-4d0c-b36d-4a2143d5fd47',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(3).jpg?alt=media&token=97576846-9af7-48ad-b104-aee76951b216',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(4).jpg?alt=media&token=e4dd278a-e187-49b7-be9b-42c0aaed5e41',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(5).jpg?alt=media&token=941a2fea-3fb4-4757-aea4-5d70db011693',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153%20(6).jpg?alt=media&token=578425e4-d45d-4bf3-a801-1abbfb666c60',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-2153.jpg?alt=media&token=678fb018-fa83-42af-89d1-3a86dad6da91',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3085%20(1).jpg?alt=media&token=51159550-76a3-495f-bfc0-2f192efa0853',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3085%20(2).jpg?alt=media&token=f5cfcfe5-cbee-438c-8000-5d260060d421',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3085.jpg?alt=media&token=c38a3a8b-a185-41a2-8328-df7f88516eca',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3089%20(1).jpg?alt=media&token=e22bd069-3577-4582-8b19-843389f6af0d',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3089%20(2).jpg?alt=media&token=83ce9c60-f2d6-4745-8fac-e0cf35f5c4a0',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3089%20(4).jpg?alt=media&token=833635d3-ac5d-411e-8b58-70ca2d5d00e2',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Pune-Hill-Half-Marathon-3089.jpg?alt=media&token=48a23930-e7a5-4a7a-ba61-68f37a205cdf',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2131.jpg?alt=media&token=40722e79-40a9-4ce9-a62e-9bfd232cb567',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2315%20(4).jpg?alt=media&token=1c3baad8-6be9-4b3a-b1e7-808b3ca9b0a4',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2315%20(5).jpg?alt=media&token=a857a9c7-5477-41c4-b12d-4fb7551d6374',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2315%20(6).jpg?alt=media&token=5b376cea-38ea-4900-9b2d-383ff7eaa71a',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2564.jpg?alt=media&token=d2ca2614-749e-40bc-9091-439e005b1432',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-2835.jpg?alt=media&token=d0c7000e-5ada-4d98-bc4d-f529814c1f5f',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-bib%20(1).jpg?alt=media&token=f2b0f0a3-1504-4e10-9829-bd1236d29d92',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-bib%20(2).jpg?alt=media&token=626bd854-88b7-4e3e-800e-2b7a40b9dbd3',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Runathon-of-Hope-bib.jpg?alt=media&token=5323cb94-5e68-420a-a3f6-3b121bba475f',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(1).jpg?alt=media&token=86d6900d-6c04-41a4-b554-f64bc33f4ddd',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(1).jpg?alt=media&token=86d6900d-6c04-41a4-b554-f64bc33f4ddd',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(3).jpg?alt=media&token=c558d606-b583-48a1-a950-f8d77f5766e6',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(5).jpg?alt=media&token=4b7bf0b9-55a4-4dc9-a372-9d62fa5c3260',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(6).jpg?alt=media&token=ab3fa1ce-80b1-4673-8190-eb68f39042e3',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(7).jpg?alt=media&token=ba9e9239-7c40-40ac-9cac-bd537036c5af',
  'https://firebasestorage.googleapis.com/v0/b/running-pictures2.appspot.com/o/Sinhagad-Marathon-2023-1363%20(8).jpg?alt=media&token=e6378649-d351-46ee-982c-a4b50775848c',
]

function FaceIndexer() {
  const [imageUrl, setImageUrl] = useState('')
  const [result, setResult] = useState('')
  const [indexing, setIndexing] = useState(false)

  const fetchFacesUsingURLS = false

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value)
  }

  const handleIndexFaces = async (event_name, image_url, config = {}) => {
    try {
      setIndexing(true)
      const response = await fetch('/api/indexFaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name,
          image_url,
          ...config,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data.status)
      } else {
        setResult('Error extracting faces')
      }
      setIndexing(false)
    } catch (error) {
      setIndexing(false)
      setResult(`Error extracting faces ${error}`)
    }
  }

  useEffect(() => {
    const fetchFaces = async () => {
      for (const url of URLS2) {
        const status = await handleIndexFaces('Runathon of Hope', url, {
          detector_backend: 'retinaface',
          model_name: 'ArcFace',
        })

        console.log(status)
      }
    }
    if (fetchFacesUsingURLS) {
      fetchFaces()
    }
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='min-w-full'>
        <h1 className='text-2xl font-semibold mb-4'>Face Extraction</h1>
        <div className='flex items-center space-x-2 flex-col gap-5'>
          <input
            id='image'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={async (event) => {
              if (event?.target?.files && event?.target?.files.length > 0) {
                console.log('imageURL', imageUrl)
                await handleIndexFaces(
                  'Runathon of Hope',
                  await handleImageUpload(event?.target?.files[0]),
                  {
                    // detector_backend: 'retinaface',
                    model_name: 'ArcFace',
                  }
                )
              }
            }}
          />
          <label htmlFor='image' className='cursor-pointer'>
            <section className='mt-4 flex flex-col items-center justify-between min-w-[600px] overflow-hidden border-2 border-black py-2'>
              <div className='py-3'>
                <svg
                  stroke='currentColor'
                  fill='currentColor'
                  stroke-width='0'
                  viewBox='0 0 1024 1024'
                  height='64'
                  width='64'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M864 248H728l-32.4-90.8a32.07 32.07 0 0 0-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80zm8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456zM512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z'></path>
                </svg>
              </div>
              <div className='flex h-full flex-col justify-center py-2 text-center'>
                <h1 className='pb-2 text-xl font-bold'>Index By Image </h1>
                <p className='text-md px-14 leading-4'>
                  Upload a picture to index faces
                </p>
              </div>
            </section>
          </label>
          <div className='flex gap-5 min-w-full'>
            <input
              type='text'
              placeholder='Enter Image URL'
              value={imageUrl}
              onChange={handleImageUrlChange}
              className='w-full p-2 border text-black rounded-lg'
            />
            <button
              onClick={async () =>
                await handleIndexFaces('Runathon of Hope', imageUrl, {
                  detector_backend: 'retinaface',
                })
              }
              className='bg-blue-500 text-white min-w-[80px] rounded-lg p-2'
            >
              Index
            </button>
          </div>
        </div>
        <div className='mt-4'>
          {indexing ? 'Please wait, this could take a few seconds...' : result}
        </div>
      </div>
    </div>
  )
}

export default FaceIndexer
