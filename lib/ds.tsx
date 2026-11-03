'use client';

/**
 * Loader for the Invest Saudi design system (vendor/invest-saudi-ds, V1.0).
 *
 * The published bundle is a plain script that reads `window.React` once and
 * assigns `window.InvestSaudiDS`. Nothing in the bundle, the tokens or the
 * stylesheet is modified here; this file only makes the bundle callable from
 * Next.js. `npm run ds:verify` checks the vendored files against their
 * published checksums.
 *
 * Because the bundle needs `window`, every component that uses it is a client
 * component and renders after mount (see `useDS`). Server rendering of the
 * design-system markup would need an ESM build of the system, which is a
 * change to the system itself and is out of scope.
 */

import * as React from 'react';
import type * as DSTypes from '@/vendor/invest-saudi-ds/index';

export type DS = typeof DSTypes & { icons: string[] };

let cache: DS | null = null;

export function loadDS(): DS | null {
  if (typeof window === 'undefined') return null;
  if (!cache) {
    const w = window as unknown as { React?: typeof React; InvestSaudiDS?: DS };
    w.React = React;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@/vendor/invest-saudi-ds/bundle.js');
    cache = w.InvestSaudiDS ?? null;
  }
  return cache;
}

/** Returns the design-system namespace once the page has mounted, null before. */
export function useDS(): DS | null {
  const [ds, setDS] = React.useState<DS | null>(null);
  React.useEffect(() => {
    setDS(loadDS());
  }, []);
  return ds;
}
