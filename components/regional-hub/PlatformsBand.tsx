'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES, SEZ_INCENTIVES } from '@/data/regional-hub';
import { Sideways, SourceLine, type HubContext } from './shared';

/**
 * Explore, continued. Where you can operate from, as a horizontal location
 * strip: a large index, the place, one line on what it permits, and the port,
 * airport or corridor that serves it as a sentence. All seven records, all
 * links, the shared incentive package stated once.
 */
export function PlatformsBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const list = ctx.route ? PLATFORMS.filter((p) => p.routes.includes(ctx.route!)) : PLATFORMS;
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLElement | null)[]>([]);
  React.useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best) setActive(Number(best.target.getAttribute('data-i')));
    }, { threshold: [0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list.length]);

  return (
    <section id="platforms" className="rh-band" aria-labelledby="rh-platforms">
      <div className="rh-container rh-stack">
        <div className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Explore</span>
          <h2 id="rh-platforms" className="display-md-semibold rh-h2">Where you can operate from</h2>
          <p className="text-lg-regular rh-muted rh-para">
            Special economic zones, a logistics zone at the Riyadh airport, and industrial cities on both coasts. The four ECZA zones share one published package: {SEZ_INCENTIVES[0].toLowerCase()}, {SEZ_INCENTIVES[1].toLowerCase()}, customs deferral and 0% VAT on intra-zone goods, shown as potentially applicable and confirmed by the zone authority.
          </p>
        </div>
        {list.length === 0 ? (
          <DS.EmptyState icon="marker-pin-01" title="No platform is listed for this route yet" description="The zone authorities have not published a platform record for the selected route." />
        ) : (
          <div className="rh-strip" role="list">
            {list.map((p, i) => (
              <article key={p.id} data-i={i} ref={(el) => { refs.current[i] = el; }} className={i === active ? 'rh-strip-item rh-strip-item--on' : 'rh-strip-item'} role="listitem">
                <span className="display-lg-semibold rh-strip-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs-medium rh-eyebrow">{p.kind}</span>
                <h3 className="text-xl-semibold rh-strip-title">{p.name}</h3>
                <p className="text-sm-regular rh-muted rh-para">{p.location}. {p.permits[0]}.</p>
                <p className="text-sm-regular rh-para"><span className="rh-strong">Connected to</span> {p.connectedTo.join(', ')}.</p>
                <p className="text-xs-regular rh-tertiary rh-para">Fits: {p.routes.map((r) => ROUTES.find((x) => x.id === r)?.title.replace(' (Regional Headquarters)', '')).join(', ')}.</p>
                <SourceLine DS={DS} p={p} />
                <Sideways
                  DS={DS}
                  items={[
                    { label: 'Zone page', href: p.href, icon: 'marker-pin-01' },
                    { label: 'On the network', href: '#connectivity', icon: 'route' },
                    { label: 'Incentives', href: `/how-to-invest/incentives?zone=${p.id}`, icon: 'coins-stacked-01' },
                  ]}
                />
              </article>
            ))}
          </div>
        )}
        <div className="rh-actions">
          <DS.Button hierarchy="link-color" size="md" href="/regions" iconTrailing="arrow-right">
            All regions and cities
          </DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="/opportunities" iconTrailing="arrow-right">
            Opportunities by location
          </DS.Button>
        </div>
      </div>
    </section>
  );
}
