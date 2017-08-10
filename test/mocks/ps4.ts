import { wait } from './utils';

interface EventListener {
  (evt: any): any
}

enum EventCode {
  launchSuccess, launchFailed, gotAuthCode, gotApiCode
};

/**
 * This is a mockery of the API exposed on the PS4
 * as in, aside from the level of inane stupidity
 * and bad design, this mock api is nothing like the
 * actual PS4 API
 *
 * This begs the question: can Sony really be this bad?
 *
 * Yes. Could you expect anything different from the people
 * who brought you:
 *
 * - no man's sky
 * - the emoji movie
 * - the meme movie
 * - the ghostbusters reboot
 * - the angry birds movie
 * - sausage part
 * - the goosebumps movie
 * - the interview
 */
export class PS4 {
  authCode?: String
  dumbApiCode?: String
  listener?: EventListener

  addEventListener(fn: EventListener) {
    this.listener = fn;
  }
  sendEvent(code: EventCode, payload?: any) {
    this.listener({ code, payload });
  }
  launchGame(this: PS4, game) {
    wait(Math.random() * 500).then(() => {
      if (this.authCode && this.dumbApiCode) {
        this.sendEvent(EventCode.launchSuccess);
      } else {
        this.sendEvent(EventCode.launchFailed);
      }
    });
  }
  requestAuthCode(this: PS4) {
    wait(Math.random() * 500).then(() => {
      this.sendEvent(EventCode.gotAuthCode, { authCode: `${Math.random()}` });
    });
  }
  requestApiCode(this: PS4) {
    wait(Math.random() * 500).then(() => {
      this.sendEvent(EventCode.gotApiCode, { dumbApiCode: `${Math.random()}` });
    });
  }
}

export class Game {
  static mock(): Game {
    return new Game(`${Math.random()}`);
  }
  id: String
  isTrash: Boolean

  constructor(id: String) {
    this.id = id;
    this.isTrash = true;
  }
}
