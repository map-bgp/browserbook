import React from "react";
import "tailwindcss/tailwind.css"

import {
  Mesh,
} from '@0x/mesh-browser-lite';

type ContentProps = {
  current: string,
  setCurrent: React.Dispatch<React.SetStateAction<string>>
  mesh: Mesh
}

const Content = (props: ContentProps) => {
  return(
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">{props.current}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Replace three lines below */}
          <div className="px-4 py-8 sm:px-0 grid grid-cols-2 gap-x-8 gap-y-8">
            <div className="flex items-center justify-center border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
              This will be a pretty market graph
            </div>
            <textarea readOnly className="text-center align-text-top bg-gray-100 resize-none row-span-2 flex items-center justify-center
             border-4 border-dashed border-gray-200 rounded-lg h-96 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
              This will be the order console
            </textarea>
            <div className="flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
              <div className="text-center my-6">This will be the order input</div>
              <button
                type="button"
                className="mx-auto block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => props.mesh.startAsync().catch(console.error)}
              >
                Stream Orders (Console)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Content
