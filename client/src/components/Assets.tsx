import React from "react";
import "tailwindcss/tailwind.css"

import {
  Mesh,
} from '@0x/mesh-browser-lite';

type AssetsProps = {
}

const tiles : any[] = [];
const numTiles = 9;

for (let i = 0; i < numTiles; i++) {
  tiles.push(
    <div key={i} className="w-2/3 sm:w-full max-w-sm bg-white shadow-md rounded-md cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
      <div className="flex-col items-center">
        <img className="w-24 h-24 my-6 mx-auto rounded-full" src="https://source.unsplash.com/random" alt="Token" />
      </div>
      <div className="px-4 py-2 bg-gray-50 rounded-b-md">
        <p className="text-sm font-medium my-2">Asset Title</p>
        <p className="text-xs text-gray-700">Asset description</p>
      </div>
    </div>
  );
}

const Assets = (props: AssetsProps) => {
  return(
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 flex flex-col items-center sm:flex-none sm:grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
        {tiles}
      </div>
    </div>
  )
}

export default Assets
