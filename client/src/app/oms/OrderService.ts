import { ethers as ethersLib } from 'ethers'
import { Token } from '../Types'
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
    { name: 'tokenId', type: 'string' },
    { name: 'orderType', type: 'uint' },
    { name: 'price', type: 'string' },
    { name: 'limitPrice', type: 'string' },
    { name: 'quantity', type: 'string' },
    { name: 'expiry', type: 'string' },
  ],
}

const getDateExpiryInMs = (expiryHours: string, expiryMinutes: string) => {
  const expiry = new Date()

  expiry.setHours(expiry.getHours() + Number(expiryHours))
  expiry.setHours(expiry.getMinutes() + Number(expiryMinutes))

  return Math.floor(expiry.getTime()).toString()
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

  const unsignedOrder: Omit<Order, 'signature'> = {
    id: (~~(Math.random() * 1e9)).toString(36) + Date.now(),
    from: fromAddress,
    tokenAddress: token.contract.address,
    tokenId: token.id,
    orderType: orderType,
    price: ethersLib.utils.parseEther(price).toString(),
    limitPrice: ethersLib.utils.parseEther(limitPrice).toString(),
    quantity: ethersLib.utils.parseEther(quantity).toString(),
    expiry: getDateExpiryInMs(expiryHours, expiryMinutes),
  }

  const signature = await signer?._signTypedData(OrderDomain, OrderTypes, unsignedOrder)
  const signedOrder = { ...unsignedOrder, signature }
  await peer.publishOrder(signedOrder)
}
