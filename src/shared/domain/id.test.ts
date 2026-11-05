import { afterEach, describe, expect, it, vi } from 'vitest';
import { createId } from './id';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('createId', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns distinct UUID v4 values', () => {
    const first = createId();
    expect(first).toMatch(UUID_V4);
    expect(createId()).not.toBe(first);
  });

  it('falls back when randomUUID is unavailable (non-secure context)', () => {
    const realCrypto = globalThis.crypto;
    const getRandomValues = vi.fn((array: Uint8Array<ArrayBuffer>) => realCrypto.getRandomValues(array));
    vi.stubGlobal('crypto', { getRandomValues });
    expect(createId()).toMatch(UUID_V4);
    expect(getRandomValues).toHaveBeenCalledOnce();
  });
});
