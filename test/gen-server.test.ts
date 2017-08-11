import { Atom } from '../src/atom';
import { start, call } from '../src/gen-server';
import { PS4, Game } from './mocks/ps4';
import { Reply } from '../src/reply';
import { Message } from '../src/message';
import { LaunchMessage, LaunchServer } from './mocks/launch-server';

describe('basic usage', () => {
  let startReply;
  let game;
  beforeEach(async () => {
    game = Game.mock();
    startReply = await start(LaunchServer, null);
  });
  test('games can be mocked', () => {
    expect(game).toBeDefined();
    expect(game.id).toBeDefined();
  });
  test('server processes can start', () => {
    const { process, status } = startReply;
    expect(process.next).toBeDefined();
    expect(status).toBe(Atom.ok);
  });
  describe('calling messages', () => {
    let requestAuthReply;
    beforeEach(async () => {
      const { process } = startReply;
      requestAuthReply = await call(process, new LaunchMessage('requestAuthCode', game));
    });
    test('we should get an ok reply', () => {
      const { status } = requestAuthReply;
      expect(status).toBe(Atom.ok);
    });
    test('new state should have game', () => {
      const { state } = requestAuthReply;
      expect(state.game).toBe(game);
    });
    test('we should have an auth code', () => {
      const { payload: authCode } = requestAuthReply;
      expect(authCode).toBeDefined();
    });
  });
});
