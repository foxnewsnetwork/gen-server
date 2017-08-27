import genProcess from "./gen-process";
import { Atom } from "./atom";
import {
  Type,
  NoreplyMessage,
  ReplyMessage,
  OrderMessage,
  CallMessage,
  InitMessage,
  DidInitMessage,
  InitProcessMessage,
  Message
} from "./message";

export interface GenServer<State> {
  init(sMsg: InitMessage<State>): Promise<DidInitMessage<State>>
  handleCall(oMsg: OrderMessage<State>): Promise<ReplyMessage<State>>
  // handleCast(msg: Message, st: State): Promise<Reply<State>>
  // handleInfo(msg: Message, st: State): Promise<Reply<State>>
  // terminate(msg: Message, st: State): Promise<Reply<State>>
  /**
  * As of `1.5.1` of Elixir, GenServer here
  * https://hexdocs.pm/elixir/GenServer.html
  * supports the additional two functions which,
  * for us here in JavaScript, is inappropriate
  *
  * codeChange
  * formatStatus
  */
}


export async function call<State>(
  this: AsyncIterableIterator<Message<State>>,
  ais: AsyncIterableIterator<Message<State>>,
  orderMsg: OrderMessage<State>,
  timeout = 5000
): Promise<ReplyMessage<State>> {
  const callMsg: CallMessage<State> = Object.assign({
    from: this,
    method: "handleCall",
    timeout
  }, orderMsg);
  const { done, value } = await ais.next(callMsg);
  let replyMessage: ReplyMessage<State> = {
    status: done ? Atom.shutdown : value.status,
    type: Type.reply,
    payload: value.payload,
    state: value.state
  };
  return replyMessage;
}

// export function cast<State>(ais: AsyncIterableIterator<State>, msg: Message): Noreply<State> {
//   ais.next({ message: msg, method: "handleCast" });

//   return new Noreply<State>(ais, Atom.ok);
// }

// export function reply<State>(ais: AsyncIterableIterator<State>, msg: Message): Noreply<State> {
//   ais.next({ message: msg, method: "handleInfo" });

//   return new Noreply<State>(ais, Atom.ok);
// }

// export async function stop<State>(this: AsyncIterableIterator<State>, ais: AsyncIterableIterator<State>, reason: any, timeout=Infinity): Promise<Reply<State>> {
//   const { done, value: lastState } = await ais.next({
//     from: this,
//     method: "terminate",
//     reason,
//     timeout
//   });
//   const status = done ? Atom.stop : Atom.error;

//   return new Reply<State>(lastState, status);
// }

interface StartOpts {
  [key: string]: any
}

export async function start<State>(
  API: GenServer<State>,
  args?: [any],
  options?: StartOpts
): Promise<InitProcessMessage<State>> {
  const initMsg: InitMessage<State> = {
    args,
    options,
    type: Type.didinit,
    status: Atom.ok
  };
  const didInitMsg = await API.init(initMsg);
  const process = genProcess<State>(API, didInitMsg);
  /**
   * Why do we `next()` here?
   * 
   * This is quirk of es7 async generators
   * (and most likely es6 regular generators),
   * but the first `next` called takes no arguments
   * and merely functions to get you to your first
   * `yield`
   * 
   * Consider looking into the `sanity.test.js` file
   * for an idea of how es7 generators work
   * 
   * Theoreticaly, if we wished to do more process
   * initialization, we"d do it here, but that"s for
   * a future functionality as I discover if I need it
   * or not.
   * 
   * ~ @foxnewsnetwork
   */
  await process.next();
  const initProcMsg: InitProcessMessage<State> = Object.assign(
    {},
    didInitMsg,
    { process, type: Type.initproc }
  );
  return initProcMsg;
}
