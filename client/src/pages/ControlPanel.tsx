import { useContext, useEffect } from 'react'
import { ethers as ethersLib } from 'ethers'
import { useDispatch } from 'react-redux'
import { useLiveQuery } from 'dexie-react-hooks'
import { ContractName } from '../app/chain/ContractMetadata'
import { EtherContractWrapper, EtherStore } from '../app/chain/EtherStore'
import { useAppSelector, useEthers } from '../app/Hooks'
import { selectAccountData } from '../app/store/slices/EthersSlice'
import {
  selectEncryptedSignerKey,
  setEncryptedSignerKey,
  setSignerAddress,
} from '../app/store/slices/ValidatorSlice'

import { AppContext } from '../components/AppContext'
import { Match, Order, OrderType } from '../app/p2p/protocol_buffers/gossip_schema'

const ControlPanel = () => {
  const dispatch = useDispatch()

  const { isConnected, accounts, primaryAccount } = useAppSelector(selectAccountData)
  const { ethers, signer, contract } = useEthers(ContractName.TokenFactory)
  const { peer, db } = useContext(AppContext)

  const encryptedSignerKey = useAppSelector(selectEncryptedSignerKey)

  const log = () => {
    console.log('Ethers', ethers, 'Signer', signer, 'Contract', contract)
    console.log('Filter function', EtherStore.getFilter(contract!, 'TokenCreated', []))
  }

  const peers = useLiveQuery(() => db.peers.toArray())
  const orders = useLiveQuery(() => db.orders.toArray())

  const encryptSigner = async () => {
    try {
      if (!!primaryAccount) {
        const [signerAddress, encryptedSignerKey] = await ethers.encryptDelegatedSigner(primaryAccount)
        dispatch(setSignerAddress(signerAddress))
        dispatch(setEncryptedSignerKey(encryptedSignerKey))
      } else {
        throw new Error('Cannot encrypt a delegated signer for an empty account')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const decryptSigner = async () => {
    if (encryptedSignerKey === null) throw new Error('Cannot decrypt null signer key')
    try {
      if (!!primaryAccount) {
        console.log('Decrypted message', await ethers.decrypt(encryptedSignerKey, primaryAccount))
      } else {
        throw new Error('Cannot decrypt a delegated signer for an empty account')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mapOrderToContractOrder = (order: Order) => {
    return {
      id: order.id,
      from: order.from,
      tokenAddress: order.tokenAddress,
      tokenId: Number(order.tokenId),
      orderType: order.orderType === OrderType.BUY ? 0 : 1,
      price: ethersLib.BigNumber.from(order.price),
      limitPrice: ethersLib.BigNumber.from(order.limitPrice),
      quantity: ethersLib.BigNumber.from(order.quantity),
      expiry: ethersLib.BigNumber.from(order.expiry),
      signature: order.signature,
    }
  }

  const waitTest = async () => {
    const bidOrder = mapOrderToContractOrder({
      expiry: '1645597547594',
      from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      id: '86upf51645367147593',
      limitPrice: '1200000000000000000',
      orderType: 0,
      price: '1000000000000000000',
      quantity: '100000000000000000000',
      signature:
        '0xd27df80be9e5fee469a248a90c907f4ce84755cd437e28f5cbc03555c14ebaa30f4e6c237d4d78f499e6940d2d0a54a39273d52c54fd2d341bbcfc2409a1a3141b',
      tokenAddress: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      tokenId: '1',
    })

    const askOrder = mapOrderToContractOrder({
      expiry: '1645549957374',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      id: '9j9leh1645377157372',
      limitPrice: '800000000000000000',
      orderType: 1,
      price: '1000000000000000000',
      quantity: '100000000000000000000',
      signature:
        '0x86ae10adfd5347dc5c59c540b002121cb88c6e8bfd96af8b5a004ac274a050ae7c57f9761b37c95e74012280bf60bcc012ea35d728056696543ef0e53b02d7951b',
      tokenAddress: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
      tokenId: '1',
    })

    const wrapper = new EtherContractWrapper()

    const contractName = ContractName.Exchange
    const contract = await wrapper.getContract(contractName)

    console.log('Contract', contract)

    const tx = await contract.executeOrder(bidOrder, askOrder)

    console.log('Transaction', tx)
    await tx.wait()
  }

  // const publishTestOrder = async () => {
  //   const order: Order = {
  //     id: (Math.random() * 1000000).toString(),
  //     tokenS: '1',
  //     tokenT: '2',
  //     amountS: 100,
  //     amountT: 100,
  //     from: 'a',
  //     status: 'good',
  //     created: 1234,
  //   }
  //   await peer.publishOrderMessage(order)
  // }

  const matchAllOrders = async () => {
    if (!peer.isValidator) {
      peer.setMatcher(true)
    }

    if (!!primaryAccount) {
      const orders: Array<Order> = await db.orders.toArray()

      for (const order of orders) {
        const match: Match = {
          id: Math.random().toString(),
          validatorAddress: primaryAccount,
          makerId: order.id,
          takerId: 'test',
          status: 'test',
        }

        await peer.publishMatchMessage(match)
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-x-8 gap-y-8 px-4 py-8 sm:grid sm:flex-none sm:grid-cols-2 sm:px-0 md:grid-cols-3">
        <div className="align-top md:col-span-1">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">System Control</h3>
            <p className="mt-1 text-sm text-gray-600">All the buttons and knobs you need</p>
          </div>
        </div>
        <div className="md:col-span-1">
          <button
            type="button"
            className="my-4 block flex w-36 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {
              log()
            }}
          >
            Log
          </button>
          <button
            type="button"
            className="my-4 block flex w-36 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {
              encryptSigner()
            }}
          >
            Encrypt Signer
          </button>
          <button
            type="button"
            className="my-4 block flex w-36 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {
              decryptSigner()
            }}
          >
            Decrypt Signer
          </button>
          {/* <button
            type="button"
            className="w-36 my-4 block flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
              publishTestOrder()
            }}
          >
            Publish Test Order
          </button> */}
          <button
            type="button"
            className="my-4 block flex w-36 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {
              matchAllOrders()
            }}
          >
            Match All Orders
          </button>
          <button
            type="button"
            className="my-4 block flex w-36 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => {
              waitTest()
            }}
          >
            Execute Order and Wait
          </button>
        </div>
        <div className="py-4 md:col-span-1">
          <h3>The Orderbook</h3>
          <ul>
            {orders?.map((order: Order) => (
              <li>{order.id}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
