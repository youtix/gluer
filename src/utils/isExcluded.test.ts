import { describe, it, expect } from 'vitest';
import { isExcluded } from './isExcluded';

describe('isExcluded', () => {
  it('should return true for excluded extensions', () => {
    expect(isExcluded('test.log', ['.log', '.png'])).toBe(true);
  });

  it('should return false for included extensions', () => {
    expect(isExcluded('main.ts', ['.log'])).toBe(false);
  });
});
