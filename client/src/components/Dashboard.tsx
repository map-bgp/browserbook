import React from "react";
import "tailwindcss/tailwind.css"

import {
  Mesh,
} from '@0x/mesh-browser-lite';

type Queue = {
  [index: number]: string
  head: number;
  tail: number;
}

function enqueue(q: Queue, s: string) {
  q[q.head] = s
  q.head++
}

function dequeue(q: Queue) {
  let temp: string = q[q.tail]
  q.tail++

  return temp
}

const rows : any[] = [];
const numrows = 5;

for (var i = 0; i < numrows; i++) {
  // note: we are adding a key prop here to allow react to uniquely identify each
  // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
  rows.push(
    <tr key={i} className="text-center">
      <td className="width-full">Streamed Order {i}</td>
    </tr>
  );
}

type DashboardProps = {
  mesh: Mesh
}

const Dashboard = (props: DashboardProps) => {
  return(
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0 grid grid-cols-2 gap-x-8 gap-y-8">
        <div className="flex items-center justify-center border-4 border-dashed border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          This will be a pretty market graph
        </div>
        <table className="table-fixed bg-gray-100 row-span-2 border-4 border-dashed border-gray-200 rounded-lg h-96 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
          <tbody key={1}>
            {rows}
          </tbody>
        </table>
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
  )
}

export default Dashboard
