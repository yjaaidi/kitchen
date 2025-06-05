import { observe } from './observe';
import { throwError } from 'rxjs';

test(`${observe.name} should throw error if not read`, () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    using observer = observe(throwError(() => new Error('💥')));
  }).toThrow('💥');
});

test(`${observe.name} should not throw error if read`, () => {
  using observer = observe(throwError(() => new Error('💥')));
  expect(observer.error).toMatchObject({ message: '💥' });
});
