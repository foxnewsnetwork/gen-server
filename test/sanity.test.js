import { wait } from './mocks/utils';
import { call } from '../src/gen-server';

test("this should just work", () => {
  expect(true).toBe(true);
});

test("we should have modules setup", () => {
  expect(call).toBeDefined();
});


describe('es7', () => {
  const waitM = jest.fn(wait);
  const postWaitM = jest.fn();

  async function* ai(t) {
    await waitM(t);
    postWaitM();
    const xxx = yield 'dog';
    return `${xxx}-end`;
  }

  const proc = ai(1);

  test('merely making the iterator only run the first part', () => {
    expect(waitM).toBeCalled();
  });

  test('should not get to the post wait', () => {
    expect(postWaitM).not.toBeCalled();
  })

  describe('iterating', () => {
    const promise = proc.next('cat');
    let result = {};
    beforeEach(async () => {
      result = await promise;
    });


    it('should be a promise', () => {
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
    });

    it('should not be done', () => {
      expect(result.done).toBeFalsy();
    });

    it('should have the yielded out value', () => {
      expect(result.value).toBe('dog');
    });
  });
});
