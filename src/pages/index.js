import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

function getCatUrls() {
  return fetch('http://shibe.online/api/cats?count=10').then(res => res.json());
}

function getCatFacts() {
  return fetch('https://meowfacts.herokuapp.com/?count=10').then(res => res.json());
}

function Cat({url, fact}) {
  return (
    <figure className='w-1/2 max-w-3xl'>
        <Image
          src={url}
          alt="A cat."
          width="0"
          height="0"
          sizes="100vw"
          className="w-full object-cover"
        />
        {/* <img src={url} alt="A cat." className='w-full object-cover'/> */}
        <figcaption className='text-left'>{fact}</figcaption>
    </figure>
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
