/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal'
import * as Long from 'long'

export const protobufPackage = 'browserbook'

export enum OrderType {
  BUY = 0,
  SELL = 1,
  UNRECOGNIZED = -1,
}

export function orderTypeFromJSON(object: any): OrderType {
  switch (object) {
    case 0:
    case 'BUY':
      return OrderType.BUY
    case 1:
    case 'SELL':
      return OrderType.SELL
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OrderType.UNRECOGNIZED
  }
}

export function orderTypeToJSON(object: OrderType): string {
  switch (object) {
    case OrderType.BUY:
      return 'BUY'
    case OrderType.SELL:
      return 'SELL'
    default:
      return 'UNKNOWN'
  }
}

export interface Order {
  id: string
  from: string
  tokenAddress: string
  tokenId: string
  orderType: OrderType
  price: string
  limitPrice: string
  quantity: string
  expiry: string
  /** Signature of all previous fields */
  signature: string
}

export interface Match {
  id: string
  validatorAddress: string
  makerId: string
  takerId: string
  status: string
}

function createBaseOrder(): Order {
  return {
    id: '',
    from: '',
    tokenAddress: '',
    tokenId: '',
    orderType: 0,
    price: '',
    limitPrice: '',
    quantity: '',
    expiry: '',
    signature: '',
  }
}

export const Order = {
  encode(message: Order, writer: Writer = Writer.create()): Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.from !== '') {
      writer.uint32(18).string(message.from)
    }
    if (message.tokenAddress !== '') {
      writer.uint32(26).string(message.tokenAddress)
    }
    if (message.tokenId !== '') {
      writer.uint32(34).string(message.tokenId)
    }
    if (message.orderType !== 0) {
      writer.uint32(40).int32(message.orderType)
    }
    if (message.price !== '') {
      writer.uint32(50).string(message.price)
    }
    if (message.limitPrice !== '') {
      writer.uint32(58).string(message.limitPrice)
    }
    if (message.quantity !== '') {
      writer.uint32(66).string(message.quantity)
    }
    if (message.expiry !== '') {
      writer.uint32(74).string(message.expiry)
    }
    if (message.signature !== '') {
      writer.uint32(82).string(message.signature)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Order {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseOrder()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.from = reader.string()
          break
        case 3:
          message.tokenAddress = reader.string()
          break
        case 4:
          message.tokenId = reader.string()
          break
        case 5:
          message.orderType = reader.int32() as any
          break
        case 6:
          message.price = reader.string()
          break
        case 7:
          message.limitPrice = reader.string()
          break
        case 8:
          message.quantity = reader.string()
          break
        case 9:
          message.expiry = reader.string()
          break
        case 10:
          message.signature = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Order {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      from: isSet(object.from) ? String(object.from) : '',
      tokenAddress: isSet(object.tokenAddress) ? String(object.tokenAddress) : '',
      tokenId: isSet(object.tokenId) ? String(object.tokenId) : '',
      orderType: isSet(object.orderType) ? orderTypeFromJSON(object.orderType) : 0,
      price: isSet(object.price) ? String(object.price) : '',
      limitPrice: isSet(object.limitPrice) ? String(object.limitPrice) : '',
      quantity: isSet(object.quantity) ? String(object.quantity) : '',
      expiry: isSet(object.expiry) ? String(object.expiry) : '',
      signature: isSet(object.signature) ? String(object.signature) : '',
    }
  },

  toJSON(message: Order): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.from !== undefined && (obj.from = message.from)
    message.tokenAddress !== undefined && (obj.tokenAddress = message.tokenAddress)
    message.tokenId !== undefined && (obj.tokenId = message.tokenId)
    message.orderType !== undefined && (obj.orderType = orderTypeToJSON(message.orderType))
    message.price !== undefined && (obj.price = message.price)
    message.limitPrice !== undefined && (obj.limitPrice = message.limitPrice)
    message.quantity !== undefined && (obj.quantity = message.quantity)
    message.expiry !== undefined && (obj.expiry = message.expiry)
    message.signature !== undefined && (obj.signature = message.signature)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Order>, I>>(object: I): Order {
    const message = createBaseOrder()
    message.id = object.id ?? ''
    message.from = object.from ?? ''
    message.tokenAddress = object.tokenAddress ?? ''
    message.tokenId = object.tokenId ?? ''
    message.orderType = object.orderType ?? 0
    message.price = object.price ?? ''
    message.limitPrice = object.limitPrice ?? ''
    message.quantity = object.quantity ?? ''
    message.expiry = object.expiry ?? ''
    message.signature = object.signature ?? ''
    return message
  },
}

function createBaseMatch(): Match {
  return { id: '', validatorAddress: '', makerId: '', takerId: '', status: '' }
}

export const Match = {
  encode(message: Match, writer: Writer = Writer.create()): Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.validatorAddress !== '') {
      writer.uint32(18).string(message.validatorAddress)
    }
    if (message.makerId !== '') {
      writer.uint32(26).string(message.makerId)
    }
    if (message.takerId !== '') {
      writer.uint32(34).string(message.takerId)
    }
    if (message.status !== '') {
      writer.uint32(42).string(message.status)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Match {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMatch()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.validatorAddress = reader.string()
          break
        case 3:
          message.makerId = reader.string()
          break
        case 4:
          message.takerId = reader.string()
          break
        case 5:
          message.status = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Match {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : '',
      makerId: isSet(object.makerId) ? String(object.makerId) : '',
      takerId: isSet(object.takerId) ? String(object.takerId) : '',
      status: isSet(object.status) ? String(object.status) : '',
    }
  },

  toJSON(message: Match): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress)
    message.makerId !== undefined && (obj.makerId = message.makerId)
    message.takerId !== undefined && (obj.takerId = message.takerId)
    message.status !== undefined && (obj.status = message.status)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Match>, I>>(object: I): Match {
    const message = createBaseMatch()
    message.id = object.id ?? ''
    message.validatorAddress = object.validatorAddress ?? ''
    message.makerId = object.makerId ?? ''
    message.takerId = object.takerId ?? ''
    message.status = object.status ?? ''
    return message
  },
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any
  configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
