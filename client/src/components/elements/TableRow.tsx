import "tailwindcss/tailwind.css";

import React from "react";
import TableCell from "./TableCell";

type CellProps = {
  items: string[];
};
//items-center bg-transparent w-full border-collapse
function TableRow(props: CellProps) {
 return (<tr>
    {props.items.map((item) => {
      return <TableCell Name={item} />;
    })}
  </tr>);
}

// @ts-ignore
export default TableRow;