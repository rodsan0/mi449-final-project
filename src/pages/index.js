import { Inter } from 'next/font/google'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { supabase } from './supabaseClient';

const inter = Inter({ subsets: ['latin'] })

function getCatUrls() {
  return fetch('http://shibe.online/api/cats?count=10').then(res => res.json());
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


  const [comments, setComments] = useState([]);
  async function getComments() {
    let { data: comms } = await supabase
      .from('cat_comments')
      .select('*')
      .eq('url', url);
      setComments(comms);
  }
  getComments();

  return (
    <>
      <figure className='w-1/2 max-w-3xl'>
          <Image
            src={url}
            alt="A cat."
            width="0"
            height="0"
            sizes="100vw"
            className="w-full object-cover"
            onClick={openModal}
          />
          {/* <img src={url} alt="A cat." className='w-full object-cover'/> */}
          <figcaption className='text-left'>{fact}</figcaption>
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
                  {url}
                </Dialog.Title>

                {
                  comments?.map(row => (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {row.comment}
                      </p>
                    </div>
                  ))
                }

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
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
  const [urls, setUrls] = useState([]);
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [catUrls, catFacts] = await Promise.all([getCatUrls(), getCatFacts()]);
      setUrls(catUrls);
      setFacts(catFacts);
    };
    fetchData();
  }, []);

  console.log(facts);

  return (
    <div className='flex flex-col items-center gap-y-10'>
      {urls.map((url, index) => (
        <Cat
          url={url}
          fact={facts.data[index]}
          key={index}
        />
      ))}
    </div>
  );
}
