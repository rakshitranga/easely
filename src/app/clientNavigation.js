'use client'  // Mark this file as a client-side component

import { useState } from 'react';
import Link from 'next/link';
import './globals.css';

export default function ClientNavigation() {
  const [selected, setSelected] = useState('');

  return (
    <div className="flex items-center mx-auto w-[50%] bg-[#F6F6F6] rounded-full p-3 m-3 text-[#858585]">
      <div className="flex items-center pl-2">
        <p className="text-blue-400 border-2 border-blue-400 rounded-lg p-1 bg-transparent">easely</p>
      </div>
      
       {/* Links Container - This will push links to the right */}
       <div className="flex justify-between ml-auto w-full ml-20">
        {/* Home Link */}
        <div>
          <Link 
            href="/" 
            onClick={() => setSelected('home')} 
            className={`p-2 rounded ${selected === 'home' ? 'bg-blue-400 text-white' : ''}`}
          >
            HOME
          </Link>
        </div>

        {/* TODO Link */}
        <div>
          <Link 
            href="/todo" 
            onClick={() => setSelected('todo')} 
            className={`p-2 rounded ${selected === 'todo' ? 'bg-blue-400 text-white' : ''}`}
          >
            TODO
          </Link>
        </div>

        {/* AURA Link */}
        <div className = "pr-10">
          <Link 
            href="/aura" 
            onClick={() => setSelected('aura')} 
            className={`p-2 rounded ${selected === 'aura' ? 'bg-blue-400 text-white' : ''}`}
          >
            AURA
          </Link>
        </div>
      </div>
    </div>
  );
}