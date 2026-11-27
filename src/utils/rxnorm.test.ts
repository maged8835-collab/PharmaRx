import { describe, expect, it, vi } from 'vitest';
import { searchRxNormIngredients } from './rxnorm';

describe('searchRxNormIngredients', () => {
  it('returns empty array for short queries', async () => {
    expect(await searchRxNormIngredients('a')).toEqual([]);
  });

  it('parses and deduplicates RxNorm drugs.json conceptGroups', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        drugGroup: {
          conceptGroup: [
            {
              tty: 'IN',
              conceptProperties: [
                { rxcui: '1234', name: 'Ertapenem' },
                { rxcui: '1234', name: 'ertapenem' },
              ],
            },
          ],
        },
      }),
    });

    vi.stubGlobal('fetch', mockFetch);
    const res = await searchRxNormIngredients('ertapenem');
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual({ rxcui: '1234', name: 'Ertapenem', tty: 'IN' });
    vi.unstubAllGlobals();
  });
});
