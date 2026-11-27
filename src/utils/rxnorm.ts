export interface RxNormIngredientMatch {
  rxcui: string;
  name: string;
  tty: string;
}

const rxNormCache = new Map<string, RxNormIngredientMatch[]>();

export async function searchRxNormIngredients(
  query: string
): Promise<RxNormIngredientMatch[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  const cacheKey = clean.toLowerCase();
  const cached = rxNormCache.get(cacheKey);
  if (cached) return cached;

  const results: RxNormIngredientMatch[] = [];
  const seenNames = new Set<string>();

  const addMatch = (rxcui: string, name: string, tty: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized || seenNames.has(normalized)) return;
    seenNames.add(normalized);
    results.push({ rxcui, name: name.trim(), tty });
  };

  try {
    const drugsRes = await fetch(
      `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(clean)}`
    );
    if (drugsRes.ok) {
      const data = await drugsRes.json();
      const groups = data?.drugGroup?.conceptGroup;
      if (Array.isArray(groups)) {
        for (const group of groups) {
          const props = group?.conceptProperties;
          if (!Array.isArray(props)) continue;
          for (const p of props) {
            if (p?.rxcui && p?.name) {
              // Prefer concise ingredient/clinical drug names
              addMatch(String(p.rxcui), String(p.name), String(group.tty || p.tty || 'RX'));
            }
          }
        }
      }
    }

    if (results.length === 0) {
      const approxRes = await fetch(
        `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(clean)}&maxEntries=8`
      );
      if (approxRes.ok) {
        const approxData = await approxRes.json();
        const candidates = approxData?.approximateGroup?.candidate;
        if (Array.isArray(candidates)) {
          for (const c of candidates) {
            if (c?.rxcui && c?.name) {
              addMatch(String(c.rxcui), String(c.name), 'APPROX');
            }
          }
        }
      }
    }
  } catch {
    return [];
  }

  const sliced = results.slice(0, 10);
  rxNormCache.set(cacheKey, sliced);
  return sliced;
}
