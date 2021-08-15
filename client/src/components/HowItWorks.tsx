import React from "react";
import "tailwindcss/tailwind.css"

type HowItWorksProps = {}

const HowItWorks = (props: HowItWorksProps) => {
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 grid grid-cols-2 gap-x-8 gap-y-8">
        <div
          className="col-span-2 flex items-center justify-center border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          <div className="text-center my-32">Please stay tuned for an overview of browserbook's internals</div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
