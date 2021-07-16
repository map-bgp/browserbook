import React from "react";
import "tailwindcss/tailwind.css"

const Content = () => {
  return(
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Replace three lines below */}
          <div className="px-4 py-8 sm:px-0">
            Here is my content
          </div>
        </div>
      </main>
    </div>
  );
}

export default Content
