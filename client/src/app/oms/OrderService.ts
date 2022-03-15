import { ethers as ethersLib } from 'ethers'
import { ChainOrder, Token } from '../Types'
import { ethers } from '../store/globals/ethers'
import { peer } from '../store/globals/peer'
import { OrderType, Order } from '../p2p/protocol_buffers/gossip_schema'
import { setExchangeApprovalForTokenContract } from './Chain'
import { ContractMetadata, ContractName } from '../chain/ContractMetadata'
import { hasOwnProperty } from '../chain/helpers'
import { store } from '../store/Store'
import { setStatus } from '../store/slices/TokensSlice'

const exchangeContract = ContractMetadata[ContractName.Exchange]

let exchangeAddress
if (hasOwnProperty(exchangeContract, 'address')) {
  exchangeAddress = exchangeContract.address
}

const OrderDomain = {
  name: 'BrowserBook',
  version: '1',
  chainId: 80001, // 80001 for testnet deployment to Mumbai
  verifyingContract: exchangeAddress,
}

const OrderTypes = {
  Order: [
    { name: 'id', type: 'string' },
    { name: 'from', type: 'address' },
    { name: 'tokenAddress', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'orderType', type: 'uint' },
    { name: 'price', type: 'uint256' },
    { name: 'limitPrice', type: 'uint256' },
    { name: 'quantity', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
  ],
}

const getDateExpiryInMs = (expiryHours: string, expiryMinutes: string) => {
  return new Date(
    new Date().getTime() + Number(expiryHours) * 60 * 60000 + Number(expiryMinutes) * 60000,
  ).valueOf()
}

const chainOrderToPeerOrder = (chainOrder: Omit<ChainOrder, 'signature'>): Omit<Order, 'signature'> => {
  return {
    id: chainOrder.id,
    from: chainOrder.from,
    tokenAddress: chainOrder.tokenAddress,
    tokenId: chainOrder.tokenId.toString(),
    orderType: chainOrder.orderType === 0 ? OrderType.BUY : OrderType.SELL,
    price: chainOrder.price.toString(),
    limitPrice: chainOrder.limitPrice.toString(),
    quantity: chainOrder.quantity.toString(),
    expiry: chainOrder.expiry.toString(),
  }
}

export const submitOrder = async (
  fromAddress: string,
  token: Token,
  orderType: OrderType,
  price: string,
  limitPrice: string,
  quantity: string,
  expiryHours: string,
  expiryMinutes: string,
) => {
  store.dispatch(setStatus('loading'))
  const signer = ethers.getSigner()

  if (orderType === OrderType.SELL && Number(price) !== Number(limitPrice)) {
    throw new Error('Limit price must be equal to price for SELL order')
  }

  if (orderType === OrderType.SELL) {
    await setExchangeApprovalForTokenContract(fromAddress, token.contract.address)
  }

  const unsignedOrder: Omit<ChainOrder, 'signature'> = {
    id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
    from: fromAddress,
    tokenAddress: token.contract.address,
    tokenId: ethersLib.BigNumber.from(token.id),
    orderType: orderType === OrderType.BUY ? 0 : 1,
    price: ethersLib.utils.parseEther(price),
    limitPrice: ethersLib.utils.parseEther(limitPrice),
    quantity: ethersLib.utils.parseEther(quantity),
    expiry: ethersLib.BigNumber.from(getDateExpiryInMs(expiryHours, expiryMinutes)),
  }

  const signature = await signer?._signTypedData(OrderDomain, OrderTypes, unsignedOrder)
  const signedOrder: Order = { ...chainOrderToPeerOrder(unsignedOrder), signature }
  await peer.publishOrder(signedOrder)
  store.dispatch(setStatus('idle'))
}

export const submitTestOrder = async (
  token: Token,
  orderType: OrderType,
  privateKey: string,
  checkApproval: boolean = true,
) => {
  const wallet = new ethersLib.Wallet(privateKey)
  const fromAddress = wallet.address
  const price = '0.00001'
  const limitPrice = price
  const quantity = '0.00001'

  const expiryHours = '1'
  const expiryMinutes = '30'

  if (orderType === OrderType.SELL && Number(price) !== Number(limitPrice)) {
    throw new Error('Limit price must be equal to price for SELL order')
  }

  if (orderType === OrderType.SELL && checkApproval) {
    await setExchangeApprovalForTokenContract(fromAddress, token.contract.address)
  }

  const unsignedOrder: Omit<ChainOrder, 'signature'> = {
    id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
    from: fromAddress,
    tokenAddress: token.contract.address,
    tokenId: ethersLib.BigNumber.from(token.id),
    orderType: orderType === OrderType.BUY ? 0 : 1,
    price: ethersLib.utils.parseEther(price),
    limitPrice: ethersLib.utils.parseEther(limitPrice),
    quantity: ethersLib.utils.parseEther(quantity),
    expiry: ethersLib.BigNumber.from(getDateExpiryInMs(expiryHours, expiryMinutes)),
  }

  const signature = await wallet?._signTypedData(OrderDomain, OrderTypes, unsignedOrder)
  const signedOrder: Order = { ...chainOrderToPeerOrder(unsignedOrder), signature }
  await peer.addOrder(signedOrder)
}

export const fillOrderBook = async (token: Token, testSize: number) => {
  const PRIVATE_KEY_BUY = process.env.PERF_TEST_KEY_BUY as string
  for (let i = 0; i < testSize; i++) {
    if (i % 100 === 0 && i !== 0) {
      console.log(`${i} BUY orders commited to orderbook`)
    }
    submitTestOrder(token, OrderType.BUY, PRIVATE_KEY_BUY)
  }

  const PRIVATE_KEY_SELL = process.env.PERF_TEST_KEY_SELL as string
  submitTestOrder(token, OrderType.SELL, PRIVATE_KEY_SELL)

  for (let i = 1; i < testSize; i++) {
    if (i % 100 === 0 && i !== 0) {
      console.log(`${i} SELL orders commited to orderbook`)
    }
    submitTestOrder(token, OrderType.SELL, PRIVATE_KEY_SELL, false)
  }

  console.log('Orderbook filled')
}
