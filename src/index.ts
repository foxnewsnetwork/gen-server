interface GameLaunchState {

}

const OK = Symbol("ok");
const INITIAL_STATE: GameLaunchState = {};
const LAUNCH_GAME = Symbol("launchGame");

const GAME_LAUNCHER_CALL_HANDLERS = {
  [LAUNCH_GAME](game, _from, launchState) {

  }
};

const GameLauncher: GenServer = {
  // Client API
  launchGame(launchProcess, game) {

  },

  switchGame(launchProcess, game) {

  },

  // Server Callbacks
  *init() {
    return yield { status: OK, state: INITIAL_STATE };
  },

  *handleCall({ handle, payload }, from, launchState) {
    return yield GAME_LAUNCHER_CALL_HANDLERS[handle](payload, from, launchState);
  }
};
