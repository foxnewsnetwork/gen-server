function shouldGiveUpAndKillSelf<S>(state: ProcState<S>): boolean {
  return state.meta.attempts > 5;
}
function shouldTryAgain<S>(state: ProcState<S>, childSpec: ChildSpec): boolean {
  return !shouldGiveUpAndKillSelf(state, childSpec);
}

function advanceError<S>(state: ProcState<S>, error: Error): ProcState<S> {
  state.meta.attempts++;
  state.meta.code = 'error';
  return state;
}

type ProcCode = 'ok' | 'shutdown' | 'error';
interface ReceiveSpec {
  timeout: number;
  afterFn(): void;
}

interface ProcState<S> {
  state: S;
  meta: {
    code: ProcCode;
    attempts: number;
  };
}

interface ChildSpec {
  maxAttempts: number;
}

type ProcMsg<S> = [ProcCode] | [ProcCode, S];

function liftState<S>(state: S): ProcState<S> {
  return {
    state,
    meta: {
      code: 'ok',
      attempts: 0
    }
  };
}

interface ProcFn<S> {
  (procMsg: ProcMsg<S>): Promise<S>;
}

async function* _process<S>(
  initState: S,
  procFn: ProcFn<S>,
  receiveSpec: ReceiveSpec,
  childSpec: ChildSpec
) {
  let procState: ProcState<S> = liftState(initState);
  let shutdownMsg: ProcMsg<S>;

  while (true) {
    /**
     * This is the `receive` statement
     */
    const procMsg: ProcMsg<S> = yield [procState, receiveSpec];
    try {
      /**
       * This is where the user's function is used
       */
      const nakedState: S = await procFn(procMsg);
      procState = liftState(nakedState);
    } catch (error) {
      if (shouldTryAgain(procState, childSpec)) {
        procState = advanceError(procState, error);
        continue;
      } else {
        shutdownMsg = ['error', procState.state];
        break;
      }
    } finally {
      const [code] = procMsg;
      if (code === 'shutdown') {
        shutdownMsg = [code, procState.state];
        break;
      }
    }
  }
  return shutdownMsg;
}
