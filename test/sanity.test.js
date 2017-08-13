import { wait } from './mocks/utils';
import { call } from '../src/gen-server';

test("this should just work", () => {
  expect(true).toBe(true);
});

test("we should have modules setup", () => {
  expect(call).toBeDefined();
});


describe('es7 async generators', () => {
  const waitM = jest.fn(wait);
  const postWaitM = jest.fn();
  const postYieldM = jest.fn();

  async function* ai(t) {
    await waitM(t);
    postWaitM();
    const xxx = yield 'dog';
    postYieldM(xxx);
    return `${xxx}-end`;
  }

  let proc;

  beforeAll(() => {
    proc = ai(1);
  });

  test('merely making the iterator only run the first part', () => {
    expect(waitM).not.toBeCalled();
  });

  test('should not get to the post wait', () => {
    expect(postWaitM).not.toBeCalled();
  })

  describe('iterating', () => {
    let promise;
    let result = {};
    beforeAll(async () => {
      promise = proc.next('doesnt matter');
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

    it('should have called the awaited method before yield', () => {
      expect(waitM).toBeCalled();
    });

    it('should have called the post await method before yield', () => {
      expect(postWaitM).toBeCalled();;
    });

    it('should not have called the post-yield method', () => {
      expect(postYieldM).not.toBeCalled();
    });

    describe('terminating', () => {
      let finalResult = {};
      beforeAll(async () => {
        finalResult = await proc.next('cat');
      });
      it('should be the terminal thing', () => {
        expect(finalResult.done).toBeTruthy();
      });
      it('should return the expected value', () => {
        expect(finalResult.value).toBe('cat-end');
      });
      it('should have called the post yield IO method', () => {
        expect(postYieldM).toBeCalledWith('cat');
      });
    });
  });
});
