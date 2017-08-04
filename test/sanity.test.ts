import { call } from '../src/gen-server';

test("this should just work", () => {
  expect(true).toBe(true);
});

test("we should have modules setup", () => {
  expect(call).toBeDefined();
});
