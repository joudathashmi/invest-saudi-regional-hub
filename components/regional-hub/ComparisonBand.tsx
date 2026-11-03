'use client';

import type { DS } from '@/lib/ds';
import { COMPARISON, HUBS, ROUTES, type ComparisonRow } from '@/data/regional-hub';
import { SourceLine, type HubContext } from './shared';

/**
 * Band 9: hub comparison. A fixed attribute set per route against the UAE,
 * Qatar, Egypt and Türkiye. Every cell is a sourced figure; Saudi is not
 * pre-filled with favourable numbers, and attributes where another hub leads
 * stay on the page.
 */
export function ComparisonBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const rows = ctx.route ? COMPARISON.filter((r) => r.routes.includes(ctx.route!)) : COMPARISON;
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;

  return (
    <section id="comparison" className="rh-band" aria-labelledby="rh-compare">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="How Saudi Arabia compares as a hub"
          supporting={routeTitle ? `Attributes that matter for the route "${routeTitle}". Each cell carries its own source and period.` : 'Attributes that matter for serving the region. Select a route above to narrow the list. Each cell carries its own source and period.'}
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/insights/reports" iconLeading="file-check-02">
              Download the comparison
            </DS.Button>
          }
        />
        <DS.Alert color="gray" title="Honest comparison">
          Tax rates, zone regimes and the Logistics Performance Index are public benchmarks and show where the UAE or Qatar lead. Port throughput is indicative and marked to confirm. Three rows have no sourced value yet and stay empty rather than estimated.
        </DS.Alert>
        <div className="rh-table-wrap">
          <DS.Table
            striped
            columns={[
              { key: 'attribute', title: 'Attribute' },
              ...HUBS.map((h) => ({ key: h, title: h, render: (r: ComparisonRow) => r.values[h] })),
              { key: 'prov', title: 'Data status', render: (r: ComparisonRow) => <SourceLine DS={DS} p={r} /> },
            ]}
            rows={rows}
          />
        </div>
      </div>
    </section>
  );
}
