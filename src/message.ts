import { Atom } from './atom';

export interface Message {
  status: Atom
  payload?: any
}
