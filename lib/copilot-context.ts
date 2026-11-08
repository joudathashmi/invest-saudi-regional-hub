/**
 * Page context contract for the Invest Saudi Investor Copilot and for links
 * that leave this page.
 *
 * The page publishes its current investor context in three ways so that
 * whichever integration the platform supports can pick it up:
 *
 *  1. `window.InvestSaudiPageContext` (this object), refreshed on every change.
 *  2. A `investsaudi:context` CustomEvent on `window` with the same payload.
 *  3. Query parameters on outgoing links (`industry`, `route`, `markets`, `coast`, `topic`).
 *
 * The Copilot widget, when embedded, reads (1) on open and listens to (2) for
 * changes. No backend call is made from this page; if the widget is absent
 * nothing happens. Values are the page's own enumerations, never free text.
 */
export interface PageContext {
  page: 'regional-hub';
  industry: string | null;
  route: 'export' | 'logistics' | 'services' | 'digital' | 'corporate' | null;
  markets: string[];
  coast: string | null;
  section: string | null;
  topic: string | null;
  updatedAt: string;
}

const KEY = 'investsaudi.regional-hub.context';

export function publishContext(ctx: Omit<PageContext, 'page' | 'updatedAt'>): PageContext {
  const payload: PageContext = { page: 'regional-hub', ...ctx, updatedAt: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    (window as unknown as { InvestSaudiPageContext?: PageContext }).InvestSaudiPageContext = payload;
    try { window.dispatchEvent(new CustomEvent('investsaudi:context', { detail: payload })); } catch { /* older browsers */ }
    try { window.sessionStorage.setItem(KEY, JSON.stringify({ industry: ctx.industry, route: ctx.route, markets: ctx.markets, coast: ctx.coast })); } catch { /* storage unavailable */ }
  }
  return payload;
}

export function restoreContext(): { industry: string | null; route: PageContext['route']; markets: string[]; coast?: string | null } | null {
  if (typeof window === 'undefined') return null;
  try {
    const url = new URLSearchParams(window.location.search);
    if (url.get('industry') || url.get('route') || url.get('markets') || url.get('coast')) {
      return { industry: url.get('industry'), route: (url.get('route') as PageContext['route']) ?? null, markets: (url.get('markets') ?? '').split(',').filter(Boolean), coast: url.get('coast') };
    }
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/** Query string carrying the context to another Invest Saudi page. Empty when nothing is set. */
export function contextQuery(ctx: { industry: string | null; route: string | null; markets: string[]; coast?: string | null }, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams({ from: 'regional-hub', ...extra });
  if (ctx.coast) q.set('coast', ctx.coast);
  if (ctx.industry) q.set('industry', ctx.industry);
  if (ctx.route) q.set('route', ctx.route);
  if (ctx.markets.length) q.set('markets', ctx.markets.join(','));
  return q.toString();
}
