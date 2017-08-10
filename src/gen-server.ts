import genProcess from './gen-process';
import { Atom } from './atom';
import { Reply } from './reply';
import { Message } from './message';
import { Noreply } from './noreply';

export interface GenServer<State> {
  init(args: any, opts?: any): Promise<Reply<State>>
  handleCall(msg: Message, from: AsyncIterableIterator<State>, st: State): Promise<Reply<State>>
  handleCast(msg: Message, st: State): Promise<Reply<State>>
  handleInfo(msg: Message, st: State): Promise<Reply<State>>
  terminate(msg: Message, st: State): Promise<Reply<State>>
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

export async function call<State, M>(this: AsyncIterableIterator<State>, ais: AsyncIterableIterator<State>, msg: Message<M>, timeout=5000): Promise<Reply<State>> {
  const { done, value: nextState } = await ais.next({
    from: this,
    message: msg,
    method: 'handleCall',
    timeout
  });
  const status = done ? Atom.stop : Atom.ok;

  return new Reply<State>(nextState, status);
}

export function cast<State>(ais: AsyncIterableIterator<State>, msg: Message): Noreply<State> {
  ais.next({ message: msg, method: 'handleCast' });

  return new Noreply<State>(ais, Atom.ok);
}

export function reply<State>(ais: AsyncIterableIterator<State>, msg: Message): Noreply<State> {
  ais.next({ message: msg, method: 'handleInfo' });

  return new Noreply<State>(ais, Atom.ok);
}

export async function stop<State>(this: AsyncIterableIterator<State>, ais: AsyncIterableIterator<State>, reason: any, timeout=Infinity): Promise<Reply<State>> {
  const { done, value: lastState } = await ais.next({
    from: this,
    method: 'terminate',
    reason,
    timeout
  });
  const status = done ? Atom.stop : Atom.error;

  return new Reply<State>(lastState, status);
}

export async function start<State>(API: GenServer<State>, args: any, options={}): Promise<Noreply<State>> {
  const { status, state, reason } = await API.init(args, options);
  const process = genProcess<State>(API, state);
  return new Noreply<State>(process, Atom.ok);
}
