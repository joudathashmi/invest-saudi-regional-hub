'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { COMPARISON, HUBS, ROUTES, type ComparisonRow } from '@/data/regional-hub';
import { Reveal, SourceLine, type HubContext } from './shared';

/**
 * 10 Compare. A scorecard first: each attribute with a verdict (Saudi Arabia
 * leads, level, another hub leads, or no sourced value) and the Saudi value
 * in large type; the full five-hub grid behind a control. Every row and
 * source is kept. Verdicts are editorial and sit in VERDICTS below, not in
 * the data, so the Data team can review them separately.
 */
const VERDICTS: Record<string, { v: 'leads' | 'level' | 'other' | 'none'; who?: string }> = {
  'Corporate income tax, standard rate': { v: 'other', who: 'UAE and Qatar lead on headline rate' },
  'Tax treatment for regional headquarters': { v: 'leads' },
  'Special zone corporate tax': { v: 'level', who: 'Zone regimes exist in every hub' },
  'Re-export and bonded regime': { v: 'level' },
  'Logistics Performance Index rank (of 139)': { v: 'other', who: 'UAE leads' },
  'Container throughput, largest port (TEU)': { v: 'other', who: 'UAE leads' },
  'Markets within a 4-hour flight': { v: 'leads' },
  'Double tax treaties with your selected markets': { v: 'level' },
};

export function ComparisonBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [open, setOpen] = React.useState(false);
  const [hubs, setHubs] = React.useState<string[]>(HUBS.slice(1) as unknown as string[]);
  const rows = ctx.route ? COMPARISON.filter((r) => r.routes.includes(ctx.route!)) : COMPARISON;
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;
  const verdict = (r: ComparisonRow) => (r.status === 'unavailable' ? { v: 'none' as const } : VERDICTS[r.attribute] ?? { v: 'level' as const });
  const tag = (v: 'leads' | 'level' | 'other' | 'none'): { color: 'success' | 'blue' | 'warning' | 'gray'; text: string } => v === 'leads' ? { color: 'success', text: 'Saudi Arabia leads' } : v === 'level' ? { color: 'blue', text: 'Level' } : v === 'other' ? { color: 'warning', text: 'Another hub leads' } : { color: 'gray', text: 'No sourced value yet' };
  const leads = rows.filter((r) => verdict(r).v === 'leads').length, other = rows.filter((r) => verdict(r).v === 'other').length;

  return (
    <section id="comparison" className="rh-band" aria-labelledby="rh-compare">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">10 · Compare</span>
          <h2 id="rh-compare" className="display-md-semibold rh-h2">An honest scorecard against the region&rsquo;s hubs</h2>
          <p className="text-lg-regular rh-muted rh-para">Against the UAE, Qatar, Egypt and Türkiye{routeTitle ? ` for the route "${routeTitle}"` : ''}: Saudi Arabia leads on {leads} attributes, another hub leads on {other}, and the rest are level or not yet sourced. Where others lead, it is stated.</p>
        </Reveal>
        <div className="rh-score" role="list">
          {rows.map((r) => {
            const vd = verdict(r); const t = tag(vd.v);
            return (
              <div key={r.attribute} role="listitem" className={`rh-score-row rh-score-row--${vd.v}`}>
                <span className="rh-score-mark" aria-hidden="true" />
                <span className="rh-score-attr text-md-semibold">{r.attribute}</span>
                <span className="rh-score-val display-xs-semibold">{r.status === 'unavailable' ? 'Not yet sourced' : r.values['Saudi Arabia']}</span>
                <span className="rh-score-tag"><DS.Tag size="sm" color={t.color} dot>{t.text}</DS.Tag>{vd.who && <span className="text-xs-regular rh-muted"> {vd.who}</span>}</span>
                <span className="rh-score-src"><SourceLine DS={DS} p={r} /></span>
              </div>
            );
          })}
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="secondary-gray" size="md" iconLeading={open ? 'chevron-up' : 'scale-01'} onClick={() => setOpen(!open)}>{open ? 'Hide the five-hub grid' : 'Open the five-hub grid'}</DS.Button>
          <DS.Button hierarchy="link-color" size="md" href="/insights/reports" iconLeading="file-check-02">Download the comparison</DS.Button>
        </div>
        {open && (
          <div className="rh-chips">
            <span className="text-sm-medium rh-muted">Compare Saudi Arabia with</span>
            {HUBS.slice(1).map((h) => (
              <DS.Chip key={h} size="md" checkbox selected={hubs.includes(h)} onClick={() => setHubs(hubs.includes(h) ? hubs.filter((x) => x !== h) : [...hubs, h])}>{h}</DS.Chip>
            ))}
          </div>
        )}
        {open && (
          <div className="rh-table-wrap">
            <DS.Table
              striped
              columns={[
                { key: 'attribute', title: 'Attribute' },
                ...HUBS.filter((h) => h === 'Saudi Arabia' || hubs.includes(h)).map((h) => ({ key: h, title: h, render: (r: ComparisonRow) => r.values[h] })),
                { key: 'prov', title: 'Data status', render: (r: ComparisonRow) => <SourceLine DS={DS} p={r} badge /> },
              ]}
              rows={rows}
            />
          </div>
        )}
        <p className="text-xs-regular rh-tertiary rh-para">Verdicts are editorial readings of the sourced values and are reviewed by the Data team with the figures. Three attributes have no sourced value yet and stay empty rather than estimated.</p>
      </div>
    </section>
  );
}
