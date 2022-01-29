/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal'
import * as Long from 'long'

export const protobufPackage = 'browserbook'

export interface Order {
  id: string
  tokenS: string
  tokenT: string
  amountS: number
  amountT: number
  from: string
  status: string
  created: number
}

function createBaseOrder(): Order {
  return { id: '', tokenS: '', tokenT: '', amountS: 0, amountT: 0, from: '', status: '', created: 0 }
}

export const Order = {
  encode(message: Order, writer: Writer = Writer.create()): Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.tokenS !== '') {
      writer.uint32(18).string(message.tokenS)
    }
    if (message.tokenT !== '') {
      writer.uint32(26).string(message.tokenT)
    }
    if (message.amountS !== 0) {
      writer.uint32(32).int32(message.amountS)
    }
    if (message.amountT !== 0) {
      writer.uint32(40).int32(message.amountT)
    }
    if (message.from !== '') {
      writer.uint32(50).string(message.from)
    }
    if (message.status !== '') {
      writer.uint32(58).string(message.status)
    }
    if (message.created !== 0) {
      writer.uint32(64).int32(message.created)
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
          message.tokenS = reader.string()
          break
        case 3:
          message.tokenT = reader.string()
          break
        case 4:
          message.amountS = reader.int32()
          break
        case 5:
          message.amountT = reader.int32()
          break
        case 6:
          message.from = reader.string()
          break
        case 7:
          message.status = reader.string()
          break
        case 8:
          message.created = reader.int32()
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
      tokenS: isSet(object.tokenS) ? String(object.tokenS) : '',
      tokenT: isSet(object.tokenT) ? String(object.tokenT) : '',
      amountS: isSet(object.amountS) ? Number(object.amountS) : 0,
      amountT: isSet(object.amountT) ? Number(object.amountT) : 0,
      from: isSet(object.from) ? String(object.from) : '',
      status: isSet(object.status) ? String(object.status) : '',
      created: isSet(object.created) ? Number(object.created) : 0,
    }
  },

  toJSON(message: Order): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.tokenS !== undefined && (obj.tokenS = message.tokenS)
    message.tokenT !== undefined && (obj.tokenT = message.tokenT)
    message.amountS !== undefined && (obj.amountS = Math.round(message.amountS))
    message.amountT !== undefined && (obj.amountT = Math.round(message.amountT))
    message.from !== undefined && (obj.from = message.from)
    message.status !== undefined && (obj.status = message.status)
    message.created !== undefined && (obj.created = Math.round(message.created))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Order>, I>>(object: I): Order {
    const message = createBaseOrder()
    message.id = object.id ?? ''
    message.tokenS = object.tokenS ?? ''
    message.tokenT = object.tokenT ?? ''
    message.amountS = object.amountS ?? 0
    message.amountT = object.amountT ?? 0
    message.from = object.from ?? ''
    message.status = object.status ?? ''
    message.created = object.created ?? 0
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
