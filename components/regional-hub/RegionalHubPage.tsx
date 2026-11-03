'use client';

import * as React from 'react';
import { useDS } from '@/lib/ds';
import type { HubContext } from './shared';
import { HeroBand } from './HeroBand';
import { CaseBuilderPanel, CaseFab } from './CaseBuilder';
import { SectionNav } from './SectionNav';
import { ReachBand } from './ReachBand';
import { ConnectivityBand } from './ConnectivityBand';
import { MarketAccessBand } from './MarketAccessBand';
import { PlatformsBand } from './PlatformsBand';
import { RoutesBand } from './RoutesBand';
import { IndustryBand } from './IndustryBand';
import { CompaniesBand } from './CompaniesBand';
import { ComparisonBand } from './ComparisonBand';
import { ContinueBand } from './ContinueBand';
import { CapitalBand } from './CapitalBand';
import { TalentBand } from './TalentBand';

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
  const [caseOpen, setCaseOpen] = React.useState(false);
  const [fab, setFab] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setFab(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        {/* Light and dark alternate band by band so each stage reads as its own chapter. */}
        <HeroBand DS={DS} onBuildCase={() => setCaseOpen(true)} />
        <SectionNav DS={DS} />
        <div data-theme="light" className="rh-theme-light"><ReachBand DS={DS} ctx={ctx} /></div>
        <ConnectivityBand DS={DS} ctx={ctx} onChange={setCtx} />
        <div data-theme="light" className="rh-theme-light"><MarketAccessBand DS={DS} ctx={ctx} /></div>
        <PlatformsBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><RoutesBand DS={DS} ctx={ctx} onChange={setCtx} /></div>
        <TalentBand DS={DS} />
        <div data-theme="light" className="rh-theme-light"><IndustryBand DS={DS} ctx={ctx} onPick={(industry) => setCtx({ ...ctx, industry: ctx.industry === industry ? null : industry })} /></div>
        <CapitalBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><CompaniesBand DS={DS} ctx={ctx} /></div>
        <ComparisonBand DS={DS} ctx={ctx} />
        <div data-theme="light" className="rh-theme-light"><ContinueBand DS={DS} ctx={ctx} onEditCase={() => setCaseOpen(true)} /></div>
      </main>
      <DS.Footer />
      <CaseBuilderPanel DS={DS} ctx={ctx} onChange={setCtx} open={caseOpen} onClose={() => setCaseOpen(false)} />
      <CaseFab DS={DS} visible={fab && !caseOpen} onOpen={() => setCaseOpen(true)} />
      {cookies && (
        <div style={{ position: 'fixed', insetInline: 0, bottom: 0, zIndex: 50 }}>
          <DS.CookiesPopup onAccept={decide} onDecline={decide} onClose={decide} />
        </div>
      )}
    </div>
  );
}
