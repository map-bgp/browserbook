import React from "react";
import "tailwindcss/tailwind.css"

import {
  Mesh,
} from '@0x/mesh-browser-lite';

type AssetsProps = {
}

const tiles : any[] = [];
const numTiles = 6;

for (var i = 0; i < numTiles; i++) {
  tiles.push(
    <div key={i} className="bg-white shadow-md rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
      <img src="https://source.unsplash.com/random" className="rounded-t-md object-stretch h-48 w-full pointer-events-none group-hover:opacity-75" />
      <div className="px-4 py-2">
        <p className="text-sm font-medium my-2">Asset Title</p>
        <p className="text-xs text-gray-700">Asset description</p>
      </div>
    </div>
  );
}

const Assets = (props: AssetsProps) => {
  return(
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 grid grid-cols-3 gap-x-8 gap-y-8">
        {tiles}
      </div>
    </div>
  )
}

export default Assets
