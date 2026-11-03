'use client';

import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, REACH } from '@/data/regional-hub';
import { SourceLine, marketNames, type HubContext } from './shared';

/** Band 2: reach. Five MetricItem cards, each with its provenance line. */
export function ReachBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  return (
    <section id="reach" className="rh-band" aria-labelledby="rh-reach">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="What you build on"
          supporting={`The economy, the logistics base and the digital backbone behind a Saudi hub serving ${marketNames(ctx.markets)}.`}
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/insights/data" iconTrailing="arrow-right">
              Explore regional data
            </DS.Button>
          }
        />
        <div className="rh-grid rh-grid--5">
          {[REACH[3], REACH[4], ...CONNECTIVITY_FIGURES.slice(0, 3)].map((f) => (
            <div key={f.label} className="rh-metric">
              <DS.MetricItem label={f.label} value={f.value} />
              <SourceLine DS={DS} p={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
