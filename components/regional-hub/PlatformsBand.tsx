'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES, SEZ_INCENTIVES } from '@/data/regional-hub';
import { Details, Reveal, Sideways, SourceLine, type HubContext } from './shared';
import { MiniMap } from './Globe';
import { PLATFORM_PHOTOS } from './imagery';

/**
 * Explore, continued. Where you can operate from, as the homepage's zone
 * mosaic: one large tile and smaller ones, each a photograph of the place with its
 * index, kind, name and first line of what it permits. Every record opens a
 * panel with the full detail (location, connections, fits, source, links).
 * The shared ECZA package is stated once in the "every zone includes" strip.
 */
const INCLUDES = [
  { v: '5%', l: 'Corporate income tax, up to 20 years*' },
  { v: '0%', l: 'Withholding tax on repatriated profits' },
  { v: '0%', l: 'Customs duty, deferred inside the zone' },
  { v: '0%', l: 'VAT on intra-zone goods' },
  { v: 'Flexible', l: 'Saudization and expatriate fee relief, first five years' },
];

export function PlatformsBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const list = ctx.route ? PLATFORMS.filter((p) => p.routes.includes(ctx.route!)) : PLATFORMS;
  const [detail, setDetail] = React.useState<(typeof PLATFORMS)[number] | null>(null);
  const [mode, setMode] = React.useState<'visual' | 'compare'>('visual');
  const n = list.length;
  const cls = (i: number) => {
    if (i === 0) return 'rh-mosaic-item rh-mosaic-item--big';
    if (i === n - 1 && n > 3) { const rem = (n - 3) % 3; if (rem === 1) return 'rh-mosaic-item rh-mosaic-item--wide'; if (rem === 2) return 'rh-mosaic-item rh-mosaic-item--mid'; }
    return 'rh-mosaic-item';
  };
  const region = (p: (typeof PLATFORMS)[number]) => p.location.split(',')[0].split(' (')[0];

  return (
    <section id="platforms" className="rh-band rh-glow-l" aria-labelledby="rh-platforms">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">04 · Where you operate</span>
          <h2 id="rh-platforms" className="display-md-semibold rh-h2">Zones and cities built for regional business</h2>
          <p className="text-lg-regular rh-muted rh-para">Zones on both coasts, a bonded logistics zone at the Riyadh airport, and industrial cities nationwide. Open any location.</p>
        </Reveal>
        {n > 0 && mode === 'compare' && (
          <div className="rh-table-wrap">
            <DS.Table
              striped
              columns={[
                { key: 'name', title: 'Location', render: (p: (typeof PLATFORMS)[number]) => <button type="button" className="rh-linkbtn text-sm-semibold" onClick={() => setDetail(p)}>{p.name}</button> },
                { key: 'kind', title: 'Type' },
                { key: 'permits', title: 'Industries and activities', render: (p: (typeof PLATFORMS)[number]) => p.permits[0] },
                { key: 'connectedTo', title: 'Connectivity', render: (p: (typeof PLATFORMS)[number]) => p.connectedTo.join('; ') },
                { key: 'routes', title: 'Operating models', render: (p: (typeof PLATFORMS)[number]) => p.routes.map((r) => ROUTES.find((x) => x.id === r)?.title.replace(' (Regional Headquarters)', '')).join(', ') },
                { key: 'inc', title: 'Incentives', render: (p: (typeof PLATFORMS)[number]) => <span>{p.authority === 'ECZA' || p.authority === 'ECZA with CST' ? 'SEZ package, potentially applicable' : p.id === 'ilbz' ? 'ILBZ regime, potentially applicable' : 'Programme-specific, subject to eligibility'} <DS.Tag size="sm" color="warning" dot>eligibility to confirm</DS.Tag></span> },
                { key: 'prov', title: 'Data status', render: (p: (typeof PLATFORMS)[number]) => <SourceLine DS={DS} p={p} badge /> },
              ]}
              rows={list}
            />
          </div>
        )}
        {n === 0 ? (
          <DS.EmptyState icon="marker-pin-01" title="No platform is listed for this route yet" description="The zone authorities have not published a platform record for the selected route." />
        ) : (
          <div className="rh-mosaic" role="list">
            {list.map((p, i) => (
              <button key={p.id} type="button" className={cls(i)} role="listitem" onClick={() => setDetail(p)} aria-label={`${p.name}: open details`}>
                <img className="rh-mosaic-img" src={PLATFORM_PHOTOS[p.id]?.src ?? '/img/industrial.jpg'} alt={PLATFORM_PHOTOS[p.id]?.alt ?? ''} loading="lazy" />
                <span className="rh-mosaic-text">
                  <span className="text-xs-semibold rh-eyebrow">{String(i + 1).padStart(2, '0')} · {region(p)}</span>
                  <span className={i === 0 ? 'display-xs-semibold rh-mosaic-title' : 'text-xl-semibold rh-mosaic-title'}>{p.name}</span>
                  <span className="text-sm-regular rh-mosaic-tags">{p.permits[0]}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <Details DS={DS} label="Compare locations, incentives and sources">
        <div className="rh-actions"><DS.Button hierarchy="link-gray" size="md" onClick={() => setMode(mode === 'compare' ? 'visual' : 'compare')} iconLeading="scale-01">{mode === 'compare' ? 'Hide comparison table' : 'Comparison table'}</DS.Button></div>
        <div className="rh-includes">
          <span className="text-xs-semibold rh-eyebrow">The four ECZA special economic zones share this package; ILBZ and industrial cities have their own</span>
          <dl className="rh-includes-grid">
            {INCLUDES.map((x) => (
              <div key={x.l}><dt className="display-xs-semibold">{x.v}</dt><dd className="text-sm-regular">{x.l}</dd></div>
            ))}
          </dl>
          <span className="text-xs-regular rh-tertiary">*Qualifying activities; economic-substance rules apply. Shown as potentially applicable, confirmed by the zone authority. Sources: ECZA, ZATCA, investsaudi.sa.</span>
        </div>
        </Details>
        <div className="rh-actions">
          <DS.Button hierarchy="secondary-gray" size="md" href="/regions" iconTrailing="arrow-right">All regions and cities</DS.Button>
        </div>
      </div>
      {detail && (
        <DS.SlideoutMenu title={detail.name} description={`${detail.kind} · ${detail.authority}`} open width={520} onClose={() => setDetail(null)} actions={<DS.Button hierarchy="secondary-gray" size="md" onClick={() => setDetail(null)}>Close</DS.Button>}>
          <div className="rh-stack" style={{ gap: 'var(--spacing-xl)' }}>
            <div className="rh-strip-media"><MiniMap lat={detail.lat} lon={detail.lon} zoom={detail.zoom ?? 18} label={detail.name} /></div>
            <p className="text-md-regular rh-para"><span className="rh-strong">Where.</span> {detail.location}.</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">What it permits.</span> {detail.permits.join('; ')}.</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">Connected to.</span> {detail.connectedTo.join(', ')}.</p>
            <p className="text-sm-regular rh-tertiary rh-para">Fits: {detail.routes.map((r) => ROUTES.find((x) => x.id === r)?.title.replace(' (Regional Headquarters)', '')).join(', ')}.</p>
            <SourceLine DS={DS} p={detail} badge />
            <Sideways DS={DS} items={[{ label: 'Zone page', href: detail.href, icon: 'marker-pin-01' }, { label: 'On the network', href: '#connectivity', icon: 'route' }, { label: 'Incentives', href: `/how-to-invest/incentives?zone=${detail.id}`, icon: 'coins-stacked-01' }]} />
          </div>
        </DS.SlideoutMenu>
      )}
      <span hidden>{SEZ_INCENTIVES.length}</span>
    </section>
  );
}
