import { wait } from './mocks/utils';
import { call } from '../src/gen-server';

test("this should just work", () => {
  expect(true).toBe(true);
});

test("we should have modules setup", () => {
  expect(call).toBeDefined();
});


describe('es7', () => {
  async function* ai(t) {
    await wait(t);
    return yield 'dog';
  }

  test('it should work', async () => {
    const proc = ai(1);
    const dog = await proc.next();
    expect(dog).toBe('dog');
  });
});
