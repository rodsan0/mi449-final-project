import { Inter } from 'next/font/google'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { supabase } from '../supabaseClient';

const inter = Inter({ subsets: ['latin'] })

function getCatUrls() {
  return fetch('https://shibe.online/api/cats?count=10').then(res => res.json());
}

function getCatFacts() {
  return fetch('https://meowfacts.herokuapp.com/?count=10').then(res => res.json());
}

function Cat({url, fact}) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true);
  }

  const { data: comments } = useQuery(['cat_comments', url], async () => {
    const { data } = await supabase
      .from('cat_comments')
      .select('*')
      .eq('url', url);
    return data;
  });

  return (
    <>
      <figure className='w-1/2 max-w-3xl rounded overflow-hidden shadow-lg bg-zinc-50'>
          <Image
            src={url}
            alt="A cat."
            width="0"
            height="0"
            sizes="100vw"
            className="w-full object-cover"
            onClick={openModal}
          />
          <div className='px-6 py-4'>
            <figcaption className='text-gray-700 text-xl'>{fact}</figcaption>
          </div>
      </figure>

      <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Comments
                </Dialog.Title>

                {
                  comments?.map(row => (
                    <div key={row.id} className='grid grid-cols-3 gap-4 auto-cols-max'>
                      <p className="mt-2 text-sm text-gray-500 col-span-1 text-violet-400">&#64;{row.username}&#58;</p>
                      <p className="mt-2 text-sm text-gray-500 col-span-2 text-violet-900">{row.comment}</p>
                    </div>
                  ))
                }


              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
  );
}

export default function Cats() {
  const {data: urls} = useQuery('cat_urls', getCatUrls);
  const {data: facts} = useQuery('cat_facts', getCatFacts);

  return (
    <div className='flex flex-col items-center gap-y-10 my-5'>
      {urls?.map((url, index) => (
        <Cat
          url={url}
          fact={facts?.data[index]}
          key={index}
        />
      ))}
    </div>
  );
}
