'use client';

import type { DS } from '@/lib/ds';
import { AGREEMENTS, MARKETS, TREATIES, type Agreement, type Treaty } from '@/data/regional-hub';
import { SourceLine, type HubContext } from './shared';

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

  return (
    <section id="market-access" className="rh-band" aria-labelledby="rh-access">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title="What you can sell into, and on what terms"
          supporting="Proximity, transport links and market access are three different things. This section covers the third: the agreements and treaties in force for the markets you selected. Rules of origin decide whether goods made in Saudi Arabia qualify, and each market's regulator decides licensed activities."
          actions={
            <DS.Button hierarchy="secondary-gray" size="md" href="/why-saudi/laws-and-regulations" iconTrailing="arrow-right">
              Laws and regulations
            </DS.Button>
          }
        />
        <div className="rh-table-wrap">
          <DS.Table
            columns={[
              { key: 'name', title: 'Agreement' },
              { key: 'type', title: 'Type' },
              { key: 'markets', title: 'Your markets covered', render: marketsCell },
              {
                key: 'inForce',
                title: 'Status',
                render: (a: Agreement) => (
                  <DS.Tag size="sm" color={a.inForce === 'In force' ? 'success' : 'warning'} dot>
                    {a.inForce}
                  </DS.Tag>
                ),
              },
              { key: 'summary', title: 'What it gives you' },
              { key: 'prov', title: 'Data status', render: (a: Agreement) => <SourceLine DS={DS} p={a} /> },
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
              {
                key: 'treaty',
                title: 'Treaty',
                render: (t: Treaty) => (
                  <DS.Tag size="sm" color={t.treaty === 'In force' ? 'success' : t.treaty === 'Signed, not yet in force' ? 'warning' : 'gray'} dot>
                    {t.treaty}{t.since ? ` since ${t.since}` : ''}
                  </DS.Tag>
                ),
              },
              { key: 'note', title: 'Note' },
              { key: 'prov', title: 'Data status', render: (t: Treaty) => <SourceLine DS={DS} p={t} /> },
            ]}
            rows={treaties}
          />
        </div>
      </div>
    </section>
  );
}
