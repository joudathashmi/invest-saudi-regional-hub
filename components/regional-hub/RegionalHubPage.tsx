'use client';

import * as React from 'react';
import { useDS } from '@/lib/ds';
import type { HubContext } from './shared';
import { HeroBand } from './HeroBand';
import { RouterBand } from './RouterBand';
import { ReachBand } from './ReachBand';
import { ConnectivityBand } from './ConnectivityBand';
import { MarketAccessBand } from './MarketAccessBand';
import { PlatformsBand } from './PlatformsBand';
import { RoutesBand } from './RoutesBand';
import { IndustryBand } from './IndustryBand';
import { CompaniesBand } from './CompaniesBand';
import { ComparisonBand } from './ComparisonBand';
import { ContinueBand } from './ContinueBand';

/* The file's own navigation labels, as the design system README asks ("Regent & Cities" is the file's spelling). */
const NAV = [
  { label: 'Why Saudi', href: '/why-saudi', menu: true },
  { label: 'Opportunities', href: '/opportunities', menu: true },
  { label: 'Sectors', href: '/sectors', menu: true },
  { label: 'Regent & Cities', href: '/regions', menu: true },
  { label: 'How to Invest', href: '/how-to-invest', menu: true },
  { label: 'Insights & News', href: '/insights', menu: true },
  { label: 'Contact', href: '/contact', size: 'lg' },
];

const COOKIE_KEY = 'is-cookies-decided';

export function RegionalHubPage() {
  const DS = useDS();
  const [ctx, setCtx] = React.useState<HubContext>({ industry: null, markets: [], route: null });
  const [cookies, setCookies] = React.useState(false);

  React.useEffect(() => {
    try {
      setCookies(!window.localStorage.getItem(COOKIE_KEY));
    } catch {
      setCookies(true);
    }
  }, []);

  const decide = () => {
    try {
      window.localStorage.setItem(COOKIE_KEY, '1');
    } catch {
      /* storage unavailable: the popup just closes for this view */
    }
    setCookies(false);
  };

  if (!DS) {
    // The design-system bundle runs in the browser only; this is the pre-mount state.
    return <main className="rh-page" aria-busy="true" />;
  }

  return (
    <div className="rh-page">
      <DS.Header links={NAV as never} homeHref="/" />
      <main>
        {/* Bands alternate the system's two themes: dark (default) and light (data-theme="light"). */}
        <HeroBand DS={DS} />
        <div data-theme="light" className="rh-theme-light"><RouterBand DS={DS} ctx={ctx} onChange={setCtx} /></div>
        <ReachBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><ConnectivityBand DS={DS} ctx={ctx} /></div>
        <MarketAccessBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><PlatformsBand DS={DS} ctx={ctx} /></div>
        <RoutesBand DS={DS} ctx={ctx} onChange={setCtx} />
        <div data-theme="light" className="rh-theme-light"><IndustryBand DS={DS} ctx={ctx} onPick={(industry) => setCtx({ ...ctx, industry })} /></div>
        <CompaniesBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><ComparisonBand DS={DS} ctx={ctx} /></div>
        <ContinueBand DS={DS} ctx={ctx} />
      </main>
      <DS.Footer />
      {cookies && (
        <div style={{ position: 'fixed', insetInline: 0, bottom: 0, zIndex: 50 }}>
          <DS.CookiesPopup onAccept={decide} onDecline={decide} onClose={decide} />
        </div>
      )}
    </div>
  );
}
