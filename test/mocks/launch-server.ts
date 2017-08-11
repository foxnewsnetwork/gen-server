import { Atom } from '../../src/atom';
import { GenServer } from '../../src/gen-server';
import { PS4, Game } from './ps4';
import { Reply } from '../../src/reply';
import { Message } from '../../src/message';

class LaunchState {
  ps4: PS4
  game?: Game
  constructor(ps4: PS4) {
    this.ps4 = ps4;
  }
}

export class LaunchMessage implements Message {
  status: Atom
  type: String
  payload?: any
  constructor(type: String, payload?) {
    this.status = Atom.ok;
    this.type = type;
    this.payload = payload;
  }
}

function requestAuthCode(game: Game, state: LaunchState): Promise<Reply<LaunchState>> {
  state.game = game;
  return new Promise((resolve) => {
    const reply = new Reply(state, Atom.ok, `auth-code-${game.id}`);
    return resolve(reply);
  });
}

export const LaunchServer: GenServer<LaunchState> = {
  init() {
    const ps4 = new PS4();

    return new Promise((resolve) => {
      const initState = new LaunchState(ps4);
      const reply = new Reply(initState, Atom.ok)
      resolve(reply);
    });
  },
  handleCall(message: LaunchMessage, from, state) {
    const { type, payload } = message;
    if ( type === 'requestAuthCode') {
      return requestAuthCode(payload, state);
    } else {
      throw `Bad type: ${type}`;
    }
  },
  handleCast() {

  },
  handleInfo() {

  },
  terminate() {

  }
};
