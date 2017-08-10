export function wait(time=100): Promise<any> {
  return new Promise(resolve => window.setTimeout(resolve, time));
}
