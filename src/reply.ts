import { Atom } from './atom';
import { Message } from './message';

export class Reply<State> implements Message {
  status: Atom
  state: State
  reason?: any
  payload?: any

  constructor(state: State, status: Atom, payload?: any, reason?: any) {
    this.state = state;
    this.status = status;
    this.payload = payload;
    this.reason = reason;
  }
}
