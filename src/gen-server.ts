enum AtomCode {
  ok, ignore, stop, reply, noreply, error, down, hibernate, shutdown
}
interface Reply<State> {
  status: AtomCode
  state: State
  reason: any
}

interface GenProcess {

}

export interface GenServer<State> {
  init(s: State): Reply<State>
  handleCall<Arg>(a: Ask<Arg>, from: Process, state: State): Reply<State>
  /**
  * As of `1.5.1` of Elixir, GenServer here
  * https://hexdocs.pm/elixir/GenServer.html
  * supports the additional two functions which,
  * for us here in JavaScript, is inappropriate
  *
  * codeChange
  * formatStatus
  */
}

export function call<State>(server: GenProcess<State>, request, timeout=5000) {
  return;
}

class ServerProcess<State> {

}

export function startLink<S>(gs: GenServer<S>, args, options): ServerProcess<S> {

}
