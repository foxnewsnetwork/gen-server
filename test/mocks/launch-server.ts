import { Atom } from "../../src/atom";
import { GenServer } from "../../src/gen-server";
import { PS4, Game } from "./ps4";
import {
  Type,
  ReplyMessage,
  DidInitMessage,
  OrderMessage
} from "../../src/message";

export class LaunchState {
  ps4: PS4
  game?: Game
  constructor(ps4: PS4) {
    this.ps4 = ps4;
  }
}

function requestAuthCode(game: Game, state: LaunchState): Promise<ReplyMessage<LaunchState>> {
  state.game = game;
  return new Promise((resolve) => {
    const reply: ReplyMessage<LaunchState> = {
      state,
      status: Atom.ok,
      type: Type.reply,
      payload: `auth-code-${game.id}`
    };
    return resolve(reply);
  });
}

export const LaunchServer: GenServer<LaunchState> = {
  init() {
    const ps4 = new PS4();

    return new Promise((resolve) => {
      const initState = new LaunchState(ps4);
      const didinitMsg: DidInitMessage<LaunchState> = {
        state: initState,
        status: Atom.ok,
        type: Type.didinit
      };
      resolve(didinitMsg);
    });
  },
  handleCall(orderMsg: OrderMessage<LaunchState>) {
    const {
      order: { type, data: game },
      state
    } = orderMsg;

    if (type === "requestAuthCode") {
      return requestAuthCode(game, state);
    } else {
      throw `Bad type: ${type}`;
    }
  }
};
