'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES, SEZ_INCENTIVES } from '@/data/regional-hub';
import { Details, Reveal, Sideways, SourceLine, type HubContext } from './shared';
import { CoastMap, MiniMap, type CoastPin } from './Globe';
import { PLATFORM_PHOTOS } from './imagery';

/**
 * 04 Where you operate. Told as geography, not as a catalogue: two coasts and
 * a capital. The map on the left shows where each location sits and which way
 * its coast faces; the panel on the right carries the coast's story and its
 * locations. Choosing a coast on the map or in the panel changes both. Every
 * location still opens its full record. Same seven records as before.
 */
type Coast = { id: string; eyebrow: string; title: string; faces: string; story: string; platforms: string[]; reach: { from: { lat: number; lon: number }; to: { lat: number; lon: number } }[] };

const COASTS: Coast[] = [
  { id: 'red', eyebrow: 'Red Sea coast', title: 'Face Europe and Africa', faces: 'Suez, the Mediterranean and East Africa',
    story: 'A plant on the Red Sea ships west without rounding the peninsula. King Abdullah Port sits beside the KAEC zone, Yanbu carries the Royal Commission’s industrial port, and Jazan is the closest Saudi zone to East Africa.',
    platforms: ['kaec-sez', 'rcjy', 'jazan-sez'],
    reach: [{ from: { lat: 22.45, lon: 39.1 }, to: { lat: 29.9, lon: 32.5 } }, { from: { lat: 16.95, lon: 42.55 }, to: { lat: 11.6, lon: 43.1 } }] },
  { id: 'gulf', eyebrow: 'Arabian Gulf coast', title: 'Face the GCC and Asia', faces: 'the five Gulf neighbours by road and Asia by sea',
    story: 'The industrial coast. Jubail and Ras Al-Khair sit on the deep-water ports that feedstock, metals and shipbuilding are built around, inside the Gulf customs union and on the SAR East line to Riyadh.',
    platforms: ['rak-sez', 'rcjy'],
    reach: [{ from: { lat: 27.5, lon: 49.2 }, to: { lat: 25.7, lon: 56.4 } }, { from: { lat: 26.9, lon: 49.7 }, to: { lat: 25.2, lon: 51.5 } }] },
  { id: 'capital', eyebrow: 'Riyadh', title: 'Run the region', faces: 'every GCC capital within two hours by air',
    story: 'The capital is where regional businesses are run from: headquarters, bonded air cargo through King Khalid International Airport, and cloud regions under the Cloud Computing SEZ with the data-residency framework they need.',
    platforms: ['ilbz', 'cloud-sez'],
    reach: [{ from: { lat: 24.95, lon: 46.7 }, to: { lat: 25.25, lon: 55.35 } }, { from: { lat: 24.95, lon: 46.7 }, to: { lat: 29.95, lon: 47.95 } }, { from: { lat: 24.95, lon: 46.7 }, to: { lat: 31.95, lon: 35.95 } }] },
  { id: 'anywhere', eyebrow: 'Nationwide', title: 'Build where your market is', faces: 'the nearest port, airport and highway per city',
    story: 'Serviced industrial land in 39+ MODON cities, chosen by the port and the market a factory serves, with factory licensing, ready-built units and utilities at published rates.',
    platforms: ['modon'], reach: [] },
];

const PINS: CoastPin[] = [
  { id: 'kaec', name: 'KAEC SEZ', coast: 'red', lat: 22.45, lon: 39.1, labelAt: 'left' },
  { id: 'yanbu', name: 'Yanbu', coast: 'red', lat: 24.09, lon: 38.06, labelAt: 'left' },
  { id: 'jazan', name: 'Jazan SEZ', coast: 'red', lat: 16.95, lon: 42.55, labelAt: 'left' },
  { id: 'rak', name: 'Ras Al-Khair SEZ', coast: 'gulf', lat: 27.5, lon: 49.2, labelAt: 'above' },
  { id: 'jubail', name: 'Jubail', coast: 'gulf', lat: 27.0, lon: 49.65, labelAt: 'right' },
  { id: 'riyadh', name: 'Riyadh: Cloud SEZ, ILBZ', coast: 'capital', lat: 24.75, lon: 46.7, labelAt: 'below' },
];

export function PlatformsBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [coast, setCoast] = React.useState('red');
  const [detail, setDetail] = React.useState<(typeof PLATFORMS)[number] | null>(null);
  const c = COASTS.find((x) => x.id === coast) ?? COASTS[0];
  const list = c.platforms.map((id) => PLATFORMS.find((p) => p.id === id)!).filter(Boolean);
  const fits = (p: (typeof PLATFORMS)[number]) => !ctx.route || p.routes.includes(ctx.route);
  const routeName = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title.replace(' (Regional Headquarters)', '') : null;

  return (
    <section id="platforms" className="rh-band" aria-labelledby="rh-platforms">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">04 · Where you operate</span>
          <h2 id="rh-platforms" className="display-md-semibold rh-h2">Two coasts and a capital</h2>
          <p className="text-lg-regular rh-muted rh-para">Where you build decides which markets you face. Choose a coast to see what it reaches and the zones and cities on it.</p>
        </Reveal>

        <div className="rh-coasts">
          <Reveal className="rh-coasts-map">
            <CoastMap pins={PINS} active={coast} onPick={setCoast} reach={c.reach} />
            <span className="text-xs-regular rh-coasts-note">Dashed lines show the direction each coast faces, not routes. Boundaries: Natural Earth.</span>
          </Reveal>

          <div className="rh-coasts-panel">
            <div className="rh-coast-tabs" role="tablist" aria-label="Coasts">
              {COASTS.map((x) => (
                <button key={x.id} type="button" role="tab" aria-selected={x.id === coast} className={x.id === coast ? 'rh-coast-tab rh-coast-tab--on' : 'rh-coast-tab'} onClick={() => setCoast(x.id)}>
                  <span className="text-xs-semibold rh-coast-tab-eyebrow">{x.eyebrow}</span>
                  <span className="text-md-semibold">{x.title}</span>
                </button>
              ))}
            </div>

            <div className="rh-coast-story" key={coast} role="tabpanel">
              <h3 className="display-xs-semibold rh-h3">{c.title}</h3>
              <p className="text-md-regular rh-coast-faces"><span className="rh-strong">Faces</span> {c.faces}.</p>
              <p className="text-md-regular rh-para">{c.story}</p>

              <ul className="rh-coast-list">
                {list.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="rh-coast-card" onClick={() => setDetail(p)} aria-label={`${p.name}: open details`}>
                      <img className="rh-coast-card-img" src={PLATFORM_PHOTOS[p.id]?.src ?? '/img/industrial.jpg'} alt={PLATFORM_PHOTOS[p.id]?.alt ?? ''} loading="lazy" />
                      <span className="rh-coast-card-body">
                        <span className="rh-coast-card-top">
                          <span className="text-xs-semibold rh-eyebrow">{p.kind}</span>
                          {routeName && fits(p) && <DS.Tag size="sm" color="success" dot>Fits {routeName}</DS.Tag>}
                        </span>
                        <span className="text-lg-semibold rh-coast-card-title">{p.name}</span>
                        <span className="text-sm-regular rh-muted">{p.permits[0]}</span>
                        <span className="text-xs-regular rh-tertiary rh-coast-card-links">{p.connectedTo.slice(0, 2).join(' · ')}</span>
                      </span>
                      <span className="rh-coast-card-go text-sm-semibold" aria-hidden="true">Open →</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Details DS={DS} label="Compare all seven locations, the SEZ package and sources">
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
              rows={PLATFORMS}
            />
          </div>
          <div className="rh-includes">
            <span className="text-xs-semibold rh-eyebrow">The four ECZA special economic zones share this package; ILBZ and industrial cities have their own</span>
            <dl className="rh-includes-grid">
              {[
                { v: '5%', l: 'Corporate income tax, up to 20 years*' },
                { v: '0%', l: 'Withholding tax on repatriated profits' },
                { v: '0%', l: 'Customs duty, deferred inside the zone' },
                { v: '0%', l: 'VAT on intra-zone goods' },
                { v: 'Flexible', l: 'Saudization and expatriate fee relief, first five years' },
              ].map((x) => (
                <div key={x.l}><dt className="display-xs-semibold">{x.v}</dt><dd className="text-sm-regular">{x.l}</dd></div>
              ))}
            </dl>
            <span className="text-xs-regular rh-tertiary">*Qualifying activities; economic-substance rules apply. Shown as potentially applicable, confirmed by the zone authority. Sources: ECZA, ZATCA, investsaudi.sa.</span>
          </div>
        </Details>
        <div className="rh-actions">
          <DS.Button hierarchy="primary" size="md" href="/regions" iconTrailing="arrow-right">Explore the zones</DS.Button>
          <DS.Button hierarchy="secondary-gray" size="md" href="/how-to-invest/incentives">Check zone eligibility</DS.Button>
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
