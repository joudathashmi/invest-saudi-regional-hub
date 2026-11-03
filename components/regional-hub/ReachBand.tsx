'use client';

import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, DOMESTIC, REACH } from '@/data/regional-hub';
import { SourceLine, marketNames, type HubContext } from './shared';

/**
 * Understand. The anchor market as an editorial statement: one large figure
 * set in type, the supporting facts as prose, sources as footnotes. Same five
 * records as before, no tiles.
 */
export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const lead = REACH[3];
  const facts = [DOMESTIC[0], DOMESTIC[1], REACH[4], CONNECTIVITY_FIGURES[0]];
  return (
    <section id="reach" className="rh-band" aria-labelledby="rh-reach">
      <div className="rh-container rh-editorial">
        <div className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Understand</span>
          <h2 id="rh-reach" className="display-md-semibold rh-h2">An anchor market before it is a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">
            Investors come for Saudi demand first. The region is served from that base, not instead of it. What follows is the domestic economy, then the logistics base and digital backbone a hub needs to serve {marketNames(ctx.markets)}.
          </p>
        </div>
        <div className="rh-editorial-figure">
          <span className="display-2xl-semibold rh-bignum">{lead.value}</span>
          <span className="text-lg-medium">{lead.label}</span>
          <SourceLine DS={DS} p={lead} />
        </div>
        <dl className="rh-factlist">
          {facts.map((f) => (
            <div key={f.label} className="rh-fact">
              <dt className="display-xs-semibold">{f.value}</dt>
              <dd className="text-md-regular rh-muted">
                {f.label}
                <br />
                <SourceLine DS={DS} p={f} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
