import { Atom } from './atom';

export class Noreply<T> {
  status: Atom
  process: AsyncIterableIterator<T>

  constructor(process: AsyncIterableIterator<T>, status: Atom) {
    this.process = process;
    this.status = status;
  }
}
