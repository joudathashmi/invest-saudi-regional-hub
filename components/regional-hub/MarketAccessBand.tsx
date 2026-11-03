'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { AGREEMENTS, MARKETS, TREATIES, type Agreement, type Treaty } from '@/data/regional-hub';
import { Reveal, SourceLine, type HubContext } from './shared';

/** Band 4: market access. Agreement records filtered by the selected markets. */
export function MarketAccessBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const relevant = ctx.markets.length
    ? AGREEMENTS.filter((a) => a.markets.length === 0 || a.markets.some((m) => ctx.markets.includes(m)))
    : AGREEMENTS;

  const marketsCell = (a: Agreement) => {
    const covered = a.markets.filter((m) => !ctx.markets.length || ctx.markets.includes(m));
    if (!a.markets.length) return <span className="rh-tertiary">Applies regardless of market selection</span>;
    return (
      <div className="rh-chips">
        {covered.map((code) => (
          <DS.Tag key={code} size="sm" type="sector">
            {MARKETS.find((m) => m.code === code)?.name ?? code}
          </DS.Tag>
        ))}
      </div>
    );
  };

  const treaties = TREATIES.filter((t) => !ctx.markets.length || ctx.markets.includes(t.market));
  const mname = (code: string) => MARKETS.find((m) => m.code === code)?.name ?? code;
  const [detail, setDetail] = React.useState(false);
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  const summaryMarkets = ctx.markets.length ? MARKETS.filter((m) => ctx.markets.includes(m.code)) : MARKETS.slice(0, 6);
  const summaryFor = (code: string) => {
    const ag = AGREEMENTS.filter((a) => a.markets.includes(code)).map((a) => a.name.replace(' (GAFTA)', ''));
    const t = TREATIES.find((x) => x.market === code);
    const tr = t ? (t.treaty === 'In force' ? `tax treaty in force${t.since ? ` since ${t.since}` : ''}` : t.treaty === 'Signed, not yet in force' ? 'tax treaty signed, not yet in force' : 'no tax treaty listed') : '';
    return [...ag, tr].filter(Boolean).join('; ');
  };

  return (
    <section id="market-access" className="rh-band rh-glow-r" aria-labelledby="rh-access">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">03 · Market access</span>
          <h2 id="rh-access" className="display-md-semibold rh-h2">What you can sell into, and on what terms</h2>
          <p className="text-lg-regular rh-muted rh-para">Proximity, transport links and market access are three different things. This section is the third: the agreements and treaties in force for your markets. Rules of origin decide whether goods made in Saudi Arabia qualify, and each market&rsquo;s regulator decides licensed activities. Open a market for its detail.</p>
        </Reveal>
        <div className="rh-access">
          {summaryMarkets.map((m) => {
            const open = openRow === m.code;
            const ags = AGREEMENTS.filter((a) => a.markets.includes(m.code) || a.markets.length === 0);
            const t = TREATIES.find((x) => x.market === m.code);
            return (
              <div key={m.code} className={open ? 'rh-access-row rh-access-row--open' : 'rh-access-row'}>
                <button type="button" className="rh-access-head" aria-expanded={open} onClick={() => setOpenRow(open ? null : m.code)}>
                  <span className="text-md-semibold rh-access-market">{m.name}</span>
                  <span className="text-md-regular rh-muted rh-access-sum">{summaryFor(m.code)}.</span>
                  <span className="rh-access-chev" aria-hidden="true"><DS.Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} /></span>
                </button>
                {open && (
                  <div className="rh-access-body">
                    {ags.map((a) => (
                      <p key={a.id} className="text-sm-regular rh-para"><span className="rh-strong">{a.name}</span> ({a.inForce.toLowerCase()}). {a.summary} <SourceLine DS={DS} p={a} /></p>
                    ))}
                    {t && <p className="text-sm-regular rh-para"><span className="rh-strong">Double tax treaty: {t.treaty}{t.since ? ` since ${t.since}` : ''}.</span> {t.note} <SourceLine DS={DS} p={t} /></p>}
                    <p className="text-xs-regular rh-tertiary rh-para">Regulatory market access (licensing of activities in {m.name}) is decided by that market&rsquo;s regulator and is not covered by these agreements.</p>
                  </div>
                )}
              </div>
            );
          })}
          {!ctx.markets.length && <span className="text-xs-regular rh-tertiary">Showing six markets. Set your markets in the regional case to see yours.</span>}
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="link-gray" size="md" iconLeading={detail ? 'chevron-up' : 'chevron-down'} onClick={() => setDetail(!detail)}>
            {detail ? 'Hide agreement and treaty details' : 'Open agreement and treaty details'}
          </DS.Button>
        </div>
        {detail && (
          <>
            <div className="rh-table-wrap">
              <DS.Table
                columns={[
                  { key: 'name', title: 'Agreement' },
                  { key: 'type', title: 'Type' },
                  { key: 'markets', title: 'Your markets covered', render: marketsCell },
                  { key: 'inForce', title: 'Status', render: (a: Agreement) => <DS.Tag size="sm" color={a.inForce === 'In force' ? 'success' : 'warning'} dot>{a.inForce}</DS.Tag> },
                  { key: 'summary', title: 'What it gives you' },
                  { key: 'prov', title: 'Data status', render: (a: Agreement) => <SourceLine DS={DS} p={a} badge /> },
                ]}
                rows={relevant}
              />
            </div>
            <div className="rh-table-wrap">
              <DS.Table
                title="Double tax treaties with your markets"
                badge={`${treaties.length}`}
                columns={[
                  { key: 'market', title: 'Market', render: (t: Treaty) => mname(t.market) },
                  { key: 'treaty', title: 'Treaty', render: (t: Treaty) => <DS.Tag size="sm" color={t.treaty === 'In force' ? 'success' : t.treaty === 'Signed, not yet in force' ? 'warning' : 'gray'} dot>{t.treaty}{t.since ? ` since ${t.since}` : ''}</DS.Tag> },
                  { key: 'note', title: 'Note' },
                  { key: 'prov', title: 'Data status', render: (t: Treaty) => <SourceLine DS={DS} p={t} badge /> },
                ]}
                rows={treaties}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
