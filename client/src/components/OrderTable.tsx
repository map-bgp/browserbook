import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { providers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import {useAppDispatch, useAppSelector, useEthers} from "../store/Hooks";
import Info from "./elements/Info";
import { tokenOneAbi } from "../constants";
import TableCell from "./elements/TableCell";
import TableRow from "./elements/TableRow";
import { useAppContext } from "./context/Store";

function OrderTable() {
  const dispatch = useAppDispatch();
  const { state, setContext } = useAppContext();
  const [ address,resolved] = useEthers();
  const [orderArray, setOrderArray] = useState([]);
  const [balance, setBalance] = useState();
  const [owner, setOwner] = useState();
  const [tableUpdate, setTableUpdate] = useState(false);
  const [ordersTable, setOrdersTable] = useState<any[]>();
  
  const getBalance = async () => {
    // @ts-ignore
    setBalance(await library?.getBalance());
  };

  const fetchOrders = async () => {
    const orders = await state.p2pDb.orders.toArray();
    //const randomOrdersTable : any[] = []
    // const formattedOrders = orders.map((order) => {
    //   order.tokenFrom, order.tokenTo, order.quantity, order.Price;
    // });
    //setOrderArray(formattedOrders);
    // randomOrdersTable.push(
    //   formattedOrders.map((item) => {
    //       <TableRow items={item} />;
    //     }))
    // setOrdersTable(randomOrdersTable);
    //console.log(`Number of Orders: ${formattedOrders.length}`);
    //console.log(`Token From: ${orders[1].tokenFrom}`);
  };


  useEffect(() => {
    if(resolved){
    fetchOrders();
    setTableUpdate(true);
  }
  }, [resolved]);

  const ordersNew = fetchOrders();
  
  const message = `Connected Address:${address}`;

  const balanceInfo = ` Account Balance:${balance}`;

  return (
    <div className="w-full bg-white border-gray-200 rounded px-4 py-2">
      <Info message={message} />
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => getBalance()}
      >
        Balance
      </button>
      {/* 
      <button
        type="submit"
        className="mr-0 ml-auto my-4 block flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => fetchOrders()}
      >
        display
      </button> */}

      {balance && <Info message={balanceInfo} />}

      <div className="block w-full overflow-x-auto" id="TablePlaceHolder">
        <table className="items-center bg-transparent w-full border-collapse">
          <thead>
            <tr>
              <TableCell Name={"From"} />
              <TableCell Name={"To"} />
              <TableCell Name={"Quantity"} />
              <TableCell Name={"Price"} />
            </tr>
          </thead>
          <tbody id="TableBody">{tableUpdate && ordersTable}
            <tr>
              <td>fetchOrders[1].tokenFrom</td>
              <td>order.tokenTo[1]</td>
              <td>order.quantity[1]</td>
              <td>order.Price[1]</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
