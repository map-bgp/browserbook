import { ethers } from 'ethers'
import { OrderType } from '../constants'
import Globals from '../Globals'
import { Token } from '../Types'

const OrderDomain = {
  name: 'BB Order',
  version: '1',
  chainId: 31337,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const OrderTypes = {
  Order: [
    { name: 'tokenId', type: 'int256' },
    { name: 'type', type: 'string' },
    { name: 'price', type: 'int256' },
    { name: 'limitPrice', type: 'int256' },
    { name: 'quantity', type: 'int256' },
    { name: 'expiry', type: 'int256' },
  ],
}

const getDateExpiryInMs = (expiryHours: string, expiryMinutes: string) => {
  const expiry = new Date()

  expiry.setHours(expiry.getHours() + Number(expiryHours))
  expiry.setHours(expiry.getMinutes() + Number(expiryMinutes))

  return Math.floor(expiry.getTime() / 1000).toString()
}

export const submitOrder = async (
  selected: Token,
  orderType: OrderType,
  price: string,
  limitPrice: string,
  quantity: string,
  expiryHours: string,
  expiryMinutes: string,
) => {
  const signer = Globals.ethers.getSigner()

  const order = {
    tokenId: Number(selected.id),
    type: orderType,
    price: ethers.utils.parseEther(price),
    limitPrice: ethers.utils.parseEther(limitPrice),
    quantity: ethers.utils.parseEther(quantity),
    expiry: getDateExpiryInMs(expiryHours, expiryMinutes),
  }

  console.log(order)
  const signature = await signer?._signTypedData(OrderDomain, OrderTypes, order)
  console.log('Signature', signature)
}
