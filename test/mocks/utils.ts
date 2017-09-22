export function wait(time = 100): Promise<any> {
  return new Promise(resolve => window.setTimeout(resolve, time));
}

class PromiseExpiredError extends Error {}

export function timeoutPromise<A>(promise: Promise<A>, timeout: number): Promise<A> {
  return new Promise((resolve, reject) => {
    const time = window.setTimeout(() => {
      promise
        .then(e => {
          window.clearTimeout(time);
          resolve(e);
        })
        .catch(e => {
          window.clearTimeout(time);
          reject(e);
        });
    });
  });
}

type CheckFn = () => boolean;
export function waitUntil(
  checkFn: CheckFn,
  timeout: number = 2000,
  pollInterval: number = 100
): Promise<void> {
  let interval;
  const promise: Promise<void> = new Promise((resolve, reject) => {
    interval = window.setInterval(() => {
      if (checkFn()) {
        resolve();
        window.clearInterval(interval);
      }
    }, pollInterval);
  });

  return timeoutPromise(promise, timeout).catch(e => {
    window.clearInterval(interval);
    throw e;
  });
}
