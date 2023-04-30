import { describe, expect, it } from '@jest/globals';
import { add2 } from './example';

describe('example', () => {
  describe('add2()', () => {
    it('should add 2 to a number', () => {
      expect(add2(2)).toBe(4);
    });
  });
});
