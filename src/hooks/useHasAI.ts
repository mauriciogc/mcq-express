// hooks/useHasAI.ts
'use client';
import { useEffect, useState } from 'react';

export function useHasAI() {
  const [hasAI, setHasAI] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/ai')
      .then((r) => r.json())
      .then((j) => setHasAI(!!j.hasKey))
      .catch(() => setHasAI(false));
  }, []);

  return hasAI;
}
