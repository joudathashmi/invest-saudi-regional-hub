'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { COMPARISON, HUBS, ROUTES, type ComparisonRow } from '@/data/regional-hub';
import { SourceLine, type HubContext } from './shared';

/**
 * Evaluate, continued. The honest comparison as a short read first, the full
 * grid on demand. Every row and source is kept.
 */
export function ComparisonBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [open, setOpen] = React.useState(false);
  const rows = ctx.route ? COMPARISON.filter((r) => r.routes.includes(ctx.route!)) : COMPARISON;
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;

  return (
    <section id="comparison" className="rh-band" aria-labelledby="rh-compare">
      <div className="rh-container rh-stack">
        <div className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Compare</span>
          <h2 id="rh-compare" className="display-md-semibold rh-h2">How Saudi Arabia compares as a hub</h2>
          <p className="text-lg-regular rh-muted rh-para">
            Against the UAE, Qatar, Egypt and Türkiye on the attributes that matter{routeTitle ? ` for the route "${routeTitle}"` : ''}. Where Saudi Arabia leads: the 30-year RHQ tax treatment, the SEZ and ILBZ regimes, and the reach of a 4-hour flight. Where others lead: the UAE on the Logistics Performance Index and port throughput, the UAE and Qatar on headline corporate tax rates. Three attributes have no sourced value yet and stay empty rather than estimated.
          </p>
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="secondary-gray" size="md" iconLeading={open ? 'chevron-up' : 'scale-01'} onClick={() => setOpen(!open)}>
            {open ? 'Hide the comparison grid' : 'Open the comparison grid'}
          </DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="/insights/reports" iconLeading="file-check-02">
            Download the comparison
          </DS.Button>
        </div>
        {open && (
          <div className="rh-table-wrap">
            <DS.Table
              striped
              columns={[
                { key: 'attribute', title: 'Attribute' },
                ...HUBS.map((h) => ({ key: h, title: h, render: (r: ComparisonRow) => r.values[h] })),
                { key: 'prov', title: 'Data status', render: (r: ComparisonRow) => <SourceLine DS={DS} p={r} badge /> },
              ]}
              rows={rows}
            />
          </div>
        )}
      </div>
    </section>
  );
}
