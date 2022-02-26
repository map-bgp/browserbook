import { ethers as ethersLib } from 'ethers'
import { ChainOrder, Token } from '../Types'
import { ethers } from '../store/globals/ethers'
import { peer } from '../store/globals/peer'
import { OrderType, Order } from '../p2p/protocol_buffers/gossip_schema'
import { setExchangeApprovalForTokenContract } from './Chain'
import { ContractMetadata, ContractName } from '../chain/ContractMetadata'
import { hasOwnProperty } from '../chain/helpers'

const exchangeContract = ContractMetadata[ContractName.Exchange]

let exchangeAddress
if (hasOwnProperty(exchangeContract, 'address')) {
  exchangeAddress = exchangeContract.address
}

const OrderDomain = {
  name: 'BrowserBook',
  version: '1',
  chainId: 31337,
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
  const signer = ethers.getSigner()

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
