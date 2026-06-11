import { useCallback, useEffect, useState } from "react";

/** Minimal data-fetching hook: runs `fn`, exposes data/loading/error + reload. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    setLoading(true);
    fn()
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, reload: run };
}
