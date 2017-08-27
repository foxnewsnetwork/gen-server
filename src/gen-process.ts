import { GenServer } from "./gen-server";
import { Atom } from "./atom";
import { DidInitMessage, Message } from "./message";

export default async function* genProcess<State>(API: GenServer<State>, didinitMsg: DidInitMessage<State>) {
  let nextMsg: Message<State> = didinitMsg;
  let method;

  while (true) {
    const orderMsg = yield nextMsg;
    method = orderMsg.method;

    if (method === "handleCall") {
      nextMsg = await API.handleCall(orderMsg);
    } else {
      throw "Not Implemented";
    }
  }

  // const { message } = yield message;
  // const { state: finalState, status } = await API.terminate(message, nextState);
  // if (status === Atom.stop) {
  //   return finalState;
  // } else {
  //   throw "Not implemented exit error";
  // }
}
