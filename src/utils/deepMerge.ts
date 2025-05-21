export const deepMerge = <T extends object>(
  target: T,
  source: T,
  options: { arrayMerge?: (_target: unknown[], _source: unknown[]) => unknown[] } = {}
): T => {
  if (!isMergeableObject(target)) return source;
  if (!isMergeableObject(source)) return target;

  const output = Array.isArray(target) ? [] : { ...target };

  const keys = new Set([...Object.keys(target), ...Object.keys(source)]);

  for (const key of keys) {
    const tVal = (target as Record<string, unknown>)[key];
    const sVal = (source as Record<string, unknown>)[key];

    if (Array.isArray(tVal) && Array.isArray(sVal)) {
      (output as Record<string, unknown>)[key] = options.arrayMerge
        ? options.arrayMerge(tVal, sVal)
        : [...tVal, ...sVal];
    } else if (isMergeableObject(tVal) && isMergeableObject(sVal)) {
      (output as Record<string, unknown>)[key] = deepMerge(tVal as object, sVal as object, options);
    } else {
      (output as Record<string, unknown>)[key] = sVal;
    }
  }

  return output as T;
};

const isMergeableObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);
