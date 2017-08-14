import { Atom } from '../src/atom';
import { start, call } from '../src/gen-server';
import { PS4, Game } from './mocks/ps4';
import { 
  OrderMessage, 
  ReplyMessage,
  InitProcessMessage, 
  Type 
} from '../src/message';
import { LaunchServer, LaunchState } from './mocks/launch-server';

describe('basic usage', () => {
  let startReply: InitProcessMessage<LaunchState>;
  let game;
  beforeAll(async () => {
    game = Game.mock();
    startReply = await start(LaunchServer);
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
    let requestAuthReply: ReplyMessage<LaunchState>;
    beforeAll(async () => {
      const { process, state } = startReply;
      let orderMessage: OrderMessage<LaunchState> = {
        method: 'handleCall',
        status: Atom.ok,
        state,
        type: Type.order,
        order: {
          type: 'requestAuthCode',
          data: game
        }
      };
      requestAuthReply = await call(process, orderMessage);
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
