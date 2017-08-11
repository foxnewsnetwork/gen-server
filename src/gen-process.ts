import { GenServer } from './gen-server';
import { Atom } from './atom';
import { Reply } from './reply';

export default async function* genProcess<State>(API: GenServer<State>, initState: State) {
  let nextState = initState;
  let method;

  console.warn('=======');
  while (method !== 'terminate') {
    console.warn('+++++\n', nextState, '\n++++');
    const input = yield nextState;
    console.warn('---------\n', input, '\n--------');
    const { message, from } = input;
    method = input.method;

    let reply;
    if (method === 'handleCall') {
      reply = await API.handleCall(message, from, nextState);
    } else if (method === 'handleCast') {
      reply = await API.handleCast(message, nextState);
    } else {
      reply = await API.handleInfo(message, nextState);
    }
    if (reply.status === Atom.ok) {
      nextState = reply.state;
    } else {
      throw 'Not implemented yet';
    }
  }
  const { message } = yield nextState;
  const { state: finalState, status } = await API.terminate(message, nextState);
  if (status === Atom.stop) {
    return finalState;
  } else {
    throw 'Not implemented exit error';
  }
}
