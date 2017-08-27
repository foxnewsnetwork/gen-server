import { Atom } from "./atom";

export enum Type {
  reply, noreply, call, order, init, didinit, initproc
}

export interface Message<State> {
  type: Type
  status: Atom
  payload?: any
  state?: State
}

export interface DidInitMessage<State> extends Message<State> {
  state: State
}

export interface InitProcessMessage<State> extends DidInitMessage<State> {
  process: AsyncIterableIterator<Message<State>>
}

export interface InitMessage<State> extends Message<State> {
  args: [any]
  options?: any
}

export type OrderType = "handleCall" | "handleCast" | "handleInfo" | "terminate";

export interface OrderMessage<T> extends Message<T> {
  method: OrderType
  order: {
    type: string
    data: any
  }
  state: T
}

export interface CallMessage<State> extends OrderMessage<State> {
  from?: AsyncIterableIterator<Message<State>>
  timeout: Number
}

export interface ReplyMessage<State> extends Message<State> {
  state: State
  reason?: any
}

export interface NoreplyMessage<State> extends Message<State> {
  process: AsyncIterableIterator<Message<State>>
}