// @ts-nocheck
import React, {useState, useEffect} from "react";
import "tailwindcss/tailwind.css"
import EventEmitter from "events";
import MessageHandler from "../p2p/messagehandler";
import { TOPIC } from "../constants";
import Message from "./Message";
import { useAppContext } from "./context/Store";

type OrderSubProps = {
}

export const OrderSub = (props: OrderSubProps) => {
  const { state, setContext } = useAppContext()
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [orderHandler, setorderHandler] = useState(null);
  const [peers, setPeers] = useState({});
  const eventBus = new EventEmitter();

  const sendMessage = async () => {
    setMessage("");

    if (!message) return;

    if (orderHandler.checkCommand(message)) return;

    try {
      await orderHandler.send(message);
      console.info("Publish done");
    } catch (err) {
      console.error("Could not send message", err);
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  useEffect(()=> {

    if(!state.node) return 

    console.log(`peer id: ${state.node.peerId.toB58String()}`)

    if (!orderHandler) {
      const messageHandler = new MessageHandler(state.node, TOPIC);

      // Listen for messages
      messageHandler.on("message", (message) => {
        if (message.from === state.node.peerId.toB58String()) {
          message.isMine = true;
          console.log("Got a message from Mine");
        }
        console.log("Gotta");
        setMessages((messages) => [...messages, message]);
      })
      // Listen for peer updates
      messageHandler.on("peer:update", ({ id, name }) => {
        setPeers((peers) => {
          const newPeers = { ...peers };
          newPeers[id] = { name };
          return newPeers;
        })
      })

      // Forward stats events to the eventBus
      messageHandler.on("stats", (stats) => eventBus.emit("stats", stats));

      setorderHandler(messageHandler);
      console.log("pubsub setup completed")
      }
  })


  return (
    <div className='flex flex-column w-50 pa3 h-100 bl b--black-10'>
      <div className='w-100 flex-auto'>
        <ul className='list pa0'>
          {messages.map((message, index) => {
            return <Message peers={peers} message={message} key={message.message ? message.message.id : index} />
          })}
        </ul>
      </div>
      <div className='w-100 h-auto'>
        <input onChange={e => setMessage(e.target.value)} onKeyDown={(e) => onKeyDown(e)} className='f6 f5-l input-reset fl ba b--black-20 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns' type='text' name='send' value={message} placeholder='Type your message...' />
        <input onClick={() => sendMessage()} className='f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns' type='submit' value='Send' />
      </div>
    </div>
  )
}

export default OrderSub
