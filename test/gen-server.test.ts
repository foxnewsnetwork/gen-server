import { Atom } from '../src/atom';
import { GenServer, start, call } from '../src/gen-server';
import { PS4, Game } from './mocks/ps4';
import { Reply } from '../src/reply';

class LaunchState {
  ps4: PS4
  game: Game
  constructor(ps4: PS4, game: Game) {
    this.ps4 = ps4;
    this.game = game;
  }
}

const LaunchServer: GenServer<LaunchState> = {
  init(game) {
    const ps4 = new PS4();

    return new Promise((resolve) => {
      const initState = new LaunchState(ps4, game);
      const reply = new Reply(initState, Atom.ok)
      resolve(reply);
    });
  },
  handleCall() {

  },
  handleCast() {

  },
  handleInfo() {

  },
  terminate() {

  }
};

describe('mock sanity', () => {
  test('games can be mocked', () => {
    const game = Game.mock();
    expect(game).toBeDefined();
    expect(game.id).toBeDefined();
  });
});

describe('basic usage', () => {
  test('can manipulate really bad async IO apis', async () => {
    const { process, status } = await start(LaunchServer, null);
    expect(process.next).toBeDefined();
    expect(status).toBe(Atom.ok);
    // const { status } = await call(process, { type: 'requestAuthCode', payload: game });
    // const { status } = await call(process, { type: 'requestApiCode', paylod: game });
    // const { status } = await call(process, { type: 'launchGame', payload: game });
  });
});
