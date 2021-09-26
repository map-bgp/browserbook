import "tailwindcss/tailwind.css";

import React from "react";

type CellProps = {
    Name: string;
}
//items-center bg-transparent w-full border-collapse 
function TableCell(props : CellProps) {
return (
      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
        {props.Name}
      </th>
)
}

export default TableCell;
