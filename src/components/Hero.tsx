import React from 'react'
import { RetroGrid } from './ui/retro-grid'
import { Ripple } from './ui/ripple'
import { Send } from 'lucide-react'

const Hero = () => {
  return (
      <div className="flex justify-center items-center h-screen text-gray-900">
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)"/>
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        `,
          }}
          className="z-0 absolute top-0 left-0 w-full h-full opacity-40"
        />
        <div className="relative flex flex-col items-center p-8  shadow-md rounded-lg border border-gray-300 w-full max-w-md sm:max-w-lg md:max-w-xl">
          <img src="chillguy.png" alt="Chill Guy" className="w-32 h-32 mb-4" />
          <p className="font-mono text-3xl font-semibold mb-2 text-gray-800 text-center">
            Enter your GitHub username
          </p>
          <div className="flex items-center gap-3 pt-4 w-full">
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-400 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 w-full"
   
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
             
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
         
          
            <>
              <p className="mt-8 text-center text-2xl font-mono font-bold text-gray-700">
                YOUR ROAST
              </p>
              <p className="mt-4 text-lg text-center border border-gray-300 p-4 max-w-screen-md font-mono rounded-md bg-gray-50">
                <span className="p-2 m-2 text-gray-800">{'fucfhsdhfaksfkl;'}</span>
              </p>
            </>
          
        </div>
      </div>
  )
}

export default Hero