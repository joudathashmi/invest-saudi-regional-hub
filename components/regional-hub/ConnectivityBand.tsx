'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, CORRIDORS, DIGITAL_FIGURES, DIGITAL_NODES, HUB_CITIES, LAND_PORTS, MARKETS, MODE_RELEVANCE, NODES, REACH_RINGS, SAUDI_CITIES, TREATIES, type Node } from '@/data/regional-hub';
import { Globe, greatCircleKm, type GlobeArc, type GlobeLine, type GlobePoint, type GlobeView } from './Globe';
import { Reveal, Sideways, SourceLine, marketNames, type HubContext } from './shared';

type Mode = 'air' | 'sea' | 'ground' | 'digital';
type Layer = 'all' | 'road' | 'rail' | 'ports';

/* Estimated travel time from great-circle distance. Status "estimate" until the
 * owning authority publishes a figure per pair. */
const flightHours = (km: number) => km / 850 + 0.5;
/* Global economic centres beyond the regional market list, for the air step: continent, city, coordinates.
 * Times are estimates from great-circle distance; they explain reach, they are not schedules. */
const CENTRES = [
  { id: 'c-lon', city: 'London', country: 'United Kingdom', continent: 'Europe', lat: 51.5, lon: -0.12 },
  { id: 'c-fra', city: 'Frankfurt', country: 'Germany', continent: 'Europe', lat: 50.11, lon: 8.68 },
  { id: 'c-par', city: 'Paris', country: 'France', continent: 'Europe', lat: 48.86, lon: 2.35 },
  { id: 'c-jnb', city: 'Johannesburg', country: 'South Africa', continent: 'Africa', lat: -26.2, lon: 28.04 },
  { id: 'c-del', city: 'Delhi', country: 'India', continent: 'Asia', lat: 28.61, lon: 77.21 },
  { id: 'c-sin', city: 'Singapore', country: 'Singapore', continent: 'Asia', lat: 1.35, lon: 103.82 },
  { id: 'c-sha', city: 'Shanghai', country: 'China', continent: 'Asia', lat: 31.23, lon: 121.47 },
  { id: 'c-nyc', city: 'New York', country: 'United States', continent: 'Americas', lat: 40.71, lon: -74.01 },
];
const driveHours = (km: number) => (km * 1.25) / 80;
const fmtH = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : `${h.toFixed(1).replace(/\.0$/, '')} h`);

const REGION_VIEW: GlobeView = { lat: 22, lon: 42, zoom: 1 };
const SAUDI_VIEW: GlobeView = { lat: 24, lon: 45, zoom: 3.4 };
const DIGITAL_VIEW: GlobeView = { lat: 24, lon: 44, zoom: 2.2 };
const GROUND_VIEW: GlobeView = { lat: 26.5, lon: 48.5, zoom: 3.6 };
const NEIGHBOURS = ['784', '634', '414', '512', '400', '368', '887', '048'];

/** Band 3: how strongly Saudi Arabia is connected, by air, sea and ground, on a real-world globe. */
export function ConnectivityBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange?: (c: HubContext) => void }) {
  type Step = Mode | 'integrated';
  const STEPS: Step[] = ['air', 'sea', 'ground', 'digital', 'integrated'];
  const [step, setStep] = React.useState<Step>('air');
  const [layer, setLayer] = React.useState<Layer>('all');
  const [view, setView] = React.useState<GlobeView>(REGION_VIEW);
  const [details, setDetails] = React.useState<Step | null>(null);
  const stepRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const focused = step === 'integrated';
  const mode: Mode = focused ? 'ground' : step;

  /* Scroll story: the step nearest the middle of the viewport drives the globe. */
  React.useEffect(() => {
    const els = STEPS.map((k) => stepRefs.current[k]).filter(Boolean) as HTMLDivElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { const k = e.target.getAttribute('data-step') as Step; if (k) activate(k, false); }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = (k: Step, scroll: boolean) => {
    setStep(k);
    setView(k === 'integrated' ? SAUDI_VIEW : k === 'digital' ? DIGITAL_VIEW : k === 'ground' ? GROUND_VIEW : REGION_VIEW);
    if (scroll) stepRefs.current[k]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const enterFocus = () => activate('integrated', true);

  const selected = MARKETS.filter((m) => ctx.markets.includes(m.code));
  const shown = selected.length ? selected : MARKETS;
  const riyadh = HUB_CITIES[0];
  const ground = new Set(['AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'IQ']);
  const seaMarkets = shown.filter((m) => !['KW', 'JO', 'IQ'].includes(m.code));


  /* Region view: hubs, markets, arcs, rings. */
  const regionPoints: GlobePoint[] = [
    ...(mode === 'air' ? CENTRES.map((c) => ({ id: c.id, name: c.city, lat: c.lat, lon: c.lon, kind: 'centre' as const, labelAt: (c.lon < 30 ? 'left' : 'right') as 'left' | 'right', title: `${c.city}, ${c.country}` })) : []),
    ...HUB_CITIES.map((h) => ({ ...h, kind: 'hub' as const, labelAt: (h.id === 'jed' ? 'left' : h.id === 'dmm' ? 'above' : 'below') as 'left' | 'above' | 'below' })),
    ...(mode === 'sea' ? NODES.filter((n) => n.mode === 'sea').map((n) => ({ id: n.id, name: n.name.replace(' Port', ''), lat: n.lat, lon: n.lon, kind: 'port' as const })) : []),
    ...(mode === 'digital' ? DIGITAL_NODES.map((d) => ({ id: d.id, name: d.name, lat: d.lat, lon: d.lon, kind: (d.kind === 'landing' ? 'port' : 'airport') as 'port' | 'airport', pulse: true, title: `${d.name}: ${d.note}`, labelAt: (d.lon < 44 ? 'left' : 'right') as 'left' | 'right', sub: d.kind === 'landing' ? '(landing)' : d.kind === 'cloud' ? '(cloud)' : '(planned)' })) : []),
    ...MARKETS.map((m) => {
      const on = ctx.markets.includes(m.code);
      const t = mode === 'air' && on && greatCircleKm(riyadh, m) <= 2000 ? ` · ${fmtH(flightHours(greatCircleKm(riyadh, m)))}` : mode === 'ground' && ground.has(m.code) ? ` · ${fmtH(driveHours(greatCircleKm(riyadh, m)))}` : '';
      return { id: m.code, name: on ? m.city + t : m.city, lat: m.lat, lon: m.lon, kind: 'market' as const, selected: on || (mode === 'air' && shown.includes(m)) || (mode === 'ground' && ground.has(m.code)), pulse: mode === 'digital' ? false : undefined, labelAt: (m.lon < riyadh.lon - 8 ? 'left' : 'right') as 'left' | 'right' };
    }),
  ];
  const regionArcs: GlobeArc[] =
    mode === 'air' ? [
      ...shown.map((m) => { const km = greatCircleKm(riyadh, m); const h = flightHours(km); return { from: riyadh, to: m, vehicle: 'plane' as const, hours: h, label: km > 2000 ? fmtH(h) : undefined }; }),
      ...CENTRES.map((c) => { const km = greatCircleKm(riyadh, c); const h = flightHours(km); return { from: riyadh, to: c, vehicle: 'plane' as const, thin: true, dashed: true, hours: h, label: fmtH(h) }; }),
    ]
      : mode === 'ground' ? shown.filter((m) => ground.has(m.code)).map((m) => ({ from: riyadh, to: m, dashed: true, vehicle: 'truck' as const, label: fmtH(driveHours(greatCircleKm(riyadh, m))) }))
        : mode === 'digital' ? [] : seaMarkets.map((m) => ({ from: m.lon < 44 ? { lat: 21.47, lon: 39.17 } : { lat: 26.47, lon: 50.2 }, to: m, dashed: true, vehicle: 'ship' as const }));
  const rings = mode === 'air' ? REACH_RINGS.map((r) => ({ lat: riyadh.lat, lon: riyadh.lon, km: r.km, label: r.label })) : [];

  /* Focus view: national logistics layer. */
  const showRoad = layer === 'all' || layer === 'road', showRail = layer === 'all' || layer === 'rail', showPorts = layer === 'all' || layer === 'ports';
  const focusLines: GlobeLine[] = CORRIDORS.filter((c) => (c.kind === 'road' ? showRoad : showRail)).map((c) => ({ id: c.id, kind: c.kind, points: c.points, name: c.name }));
  const cityLabel: Record<string, 'left' | 'right' | 'above' | 'below'> = { ruh: 'below', jed: 'left', dmm: 'above', mak: 'below', med: 'right', hof: 'left', qas: 'above', hail: 'right', taif: 'right', jaz: 'left', naj: 'right', tab: 'right', neom: 'left' };
  const portsOnly = layer === 'ports';
  const focusPoints: GlobePoint[] = [
    ...SAUDI_CITIES.map((c) => ({ ...c, kind: (c.id === 'ruh' ? 'hub' : 'city') as 'hub' | 'city', labelAt: cityLabel[c.id] ?? 'right', title: c.name, name: portsOnly && !['ruh', 'jed', 'dmm'].includes(c.id) ? '' : c.name })),
    ...(showPorts ? NODES.filter((n) => n.mode === 'sea').map((n) => ({ id: n.id, name: portsOnly ? n.name.replace(' Port', '') : '', lat: n.lat, lon: n.lon, kind: 'port' as const, title: n.name, labelAt: (n.id === 'jub' || n.id === 'dmm' ? 'right' : 'left') as 'left' | 'right', sub: portsOnly ? '(port)' : undefined })) : []),
    ...(showPorts ? NODES.filter((n) => n.mode === 'air').map((n) => ({ id: n.id, name: portsOnly ? n.name.replace(' International Airport', '') : '', lat: n.lat + 0.35, lon: n.lon + 0.35, kind: 'airport' as const, title: n.name, labelAt: (n.id === 'jed' ? 'left' : 'right') as 'left' | 'right', sub: portsOnly ? '(airport)' : undefined })) : []),
    ...(showRoad || showRail ? LAND_PORTS.map((b) => ({ id: b.id, name: `${b.name} → ${b.neighbour}`, lat: b.lat, lon: b.lon, kind: 'border' as const, labelAt: (['lp-haditha', 'lp-tuwal'].includes(b.id) ? 'left' : ['lp-arar', 'lp-khafji'].includes(b.id) ? 'above' : ['lp-wadiah', 'lp-batha'].includes(b.id) ? 'below' : 'right') as 'left' | 'above' | 'right' | 'below' })) : []),
  ];

  const crossings = LAND_PORTS.map((b) => ({ ...b, km: Math.round(greatCircleKm(riyadh, b)) }));
  type Crossing = (typeof crossings)[number];

  const STEP_META: Record<Step, { label: string; title: string }> = {
    air: { label: 'Air', title: 'Half the world within an eight-hour flight' },
    sea: { label: 'Sea', title: 'Two coastlines, two trade systems' },
    ground: { label: 'Land', title: 'The GCC by road within a day' },
    digital: { label: 'Digital', title: 'Landings on both coasts, cloud in the middle' },
    integrated: { label: 'Integrated network', title: 'How it joins up inside Saudi Arabia' },
  };
  const legendFor = (k: Step) =>
    k === 'integrated' ? 'Roads in brand, operating rail dashed, planned rail dotted, ports (blue) and airports (orange) as points, border crossings as diamonds labelled with the neighbour they lead to. Hover any point for its name.'
    : k === 'air' ? 'Arcs from Riyadh to each selected market with estimated flight time (great-circle distance at about 850 km/h plus 30 minutes). Pulsing rings are the published 4-hour and 8-hour flight reach.'
    : k === 'sea' ? 'Red Sea ports serve Africa, Europe and the Levant; Arabian Gulf ports serve the GCC and Asia. Transit days per port pair are not yet published, so no time is shown.'
    : k === 'digital' ? 'Subsea landing cities on both coasts (blue), cloud and data-centre locations (orange). No cable routes are drawn: cable names, capacities and provider region status come from CST and the providers before they appear here.'
    : 'Road corridors to the GCC, Jordan and Iraq from Riyadh with estimated drive time (road distance taken as 1.25 times great-circle at 80 km/h).';
  const linksFor = (k: Step) =>
    k === 'air' ? [{ label: 'Riyadh logistics zone', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Corporate base route', href: '#routes', icon: 'building-07' }, { label: 'Logistics sector', href: '/sectors/logistics', icon: 'briefcase-01' }]
    : k === 'sea' ? [{ label: 'Zones beside ports', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Export route', href: '#routes', icon: 'tool-02' }, { label: 'Agreements and rules of origin', href: '#market-access', icon: 'globe-01' }]
    : k === 'ground' ? [{ label: 'Industrial cities', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Distribution route', href: '#routes', icon: 'truck-01' }, { label: 'GCC customs union', href: '#market-access', icon: 'globe-01' }]
    : k === 'digital' ? [{ label: 'Cloud Computing SEZ', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Digital hub route', href: '#routes', icon: 'server-04' }, { label: 'ICT sector', href: '/sectors/ict', icon: 'briefcase-01' }]
    : [{ label: 'Where you can operate from', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Regions and cities', href: '/regions', icon: 'globe-01' }];
  const rowsFor = (k: Step) => (k === 'integrated' ? NODES : k === 'digital' ? [] : NODES.filter((n) => (k === 'ground' ? n.mode === 'land' : n.mode === k)));

  return (
    <section id="connectivity" className="rh-band rh-glow-l" aria-labelledby="rh-connect">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">02 · Connections</span>
          <h2 id="rh-connect" className="display-md-semibold rh-h2">Connected by air, land, sea and digital links</h2>
          <p className="text-lg-regular rh-muted rh-para">Scroll, and the globe changes with the story: how {marketNames(ctx.markets)} are reached from here, mode by mode, then how the network joins up inside Saudi Arabia. Hover any point for its detail; click a market to add it to your case. Transport links are one thing; market access is the section after this.</p>
          <DS.Tabs
            type="button-border"
            items={STEPS.map((k) => ({ label: STEP_META[k].label, value: k }))}
            value={step}
            onChange={(v: string) => activate(v as Step, true)}
          />
        </Reveal>
        <div className="rh-story">
          <div className="rh-story-visual">
            <div className="rh-globe-wrap">
              <Globe
                points={focused ? focusPoints : regionPoints}
                arcs={focused ? [] : regionArcs}
                rings={rings}
                lines={focused ? focusLines : []}
                selectedCountryIds={focused ? [] : selected.map((m) => m.countryId)}
                neighbourCountryIds={focused ? NEIGHBOURS : []}
                view={view}
                onViewChange={setView}
                onHomeClick={focused ? undefined : enterFocus}
                focused={focused}
                onPointClick={onChange && !focused ? (pt) => { const m = MARKETS.find((x) => x.code === pt.id); if (m) onChange({ ...ctx, markets: ctx.markets.includes(m.code) ? ctx.markets.filter((k) => k !== m.code) : [...ctx.markets, m.code] }); } : undefined}
                pointCard={(pt) => {
                  const m = MARKETS.find((x) => x.code === pt.id);
                  if (m) {
                    const on = ctx.markets.includes(m.code);
                    const km = Math.round(greatCircleKm(riyadh, m));
                    const t = TREATIES.find((x) => x.market === m.code);
                    return { title: `${m.name} · ${m.city}`, description: `${km.toLocaleString()} km from Riyadh, about ${fmtH(flightHours(km))} by air (estimate). ${t ? `Tax treaty: ${t.treaty.toLowerCase()}.` : ''} ${on ? 'In your case. Click to remove.' : 'Click to add to your case.'}` };
                  }
                  const n = NODES.find((x) => x.id === pt.id) ?? null;
                  if (n) return { title: n.name, description: `${n.location}. ${n.source}.` };
                  const d = DIGITAL_NODES.find((x) => x.id === pt.id) ?? null;
                  if (d) return { title: d.name, description: d.note };
                  const b = LAND_PORTS.find((x) => x.id === pt.id) ?? null;
                  if (b) return { title: `${b.name} to ${b.neighbour}`, description: b.mode === 'causeway' ? 'Causeway crossing.' : b.mode === 'road-rail-planned' ? 'Road crossing; rail planned.' : 'Road crossing.' };
                  return pt.kind === 'hub' || pt.kind === 'city' ? { title: pt.name } : null;
                }}
              />
            </div>
            {!focused && mode === 'air' && (
              <div className="rh-reach-panel">
                {(['Within 4 hours', 'Within 8 hours', 'Beyond 8 hours'] as const).map((band) => {
                  const all = [...MARKETS.map((m) => ({ city: m.city, country: m.name, continent: m.group === 'South Asia and Türkiye' ? 'Asia' : m.group.includes('Africa') ? 'Africa' : 'Middle East', h: flightHours(greatCircleKm(riyadh, m)) })), ...CENTRES.map((c) => ({ city: c.city, country: c.country, continent: c.continent, h: flightHours(greatCircleKm(riyadh, c)) }))];
                  const rows = all.filter((x) => (band === 'Within 4 hours' ? x.h <= 4 : band === 'Within 8 hours' ? x.h > 4 && x.h <= 8 : x.h > 8)).sort((a, b) => a.h - b.h);
                  const continents = Array.from(new Set(rows.map((r) => r.continent)));
                  return (
                    <div key={band} className="rh-reach-col">
                      <span className="text-xs-semibold rh-eyebrow">{band}</span>
                      <span className="text-sm-medium rh-reach-cont">{continents.join(' · ')}</span>
                      <span className="text-xs-regular rh-muted">{rows.map((r) => `${r.city} ${fmtH(r.h)}`).join(' · ')}</span>
                    </div>
                  );
                })}
                <span className="text-xs-regular rh-tertiary rh-reach-note">Estimated flight times from Riyadh (great-circle distance at about 850 km/h plus 30 minutes), not schedules. The 4-hour and 8-hour rings are the published reach figures.</span>
              </div>
            )}
            {focused && (
              <DS.Tabs
                type="button-gray"
                items={[{ label: 'All', value: 'all' }, { label: 'Roads', value: 'road' }, { label: 'Rail', value: 'rail' }, { label: 'Ports and airports', value: 'ports' }]}
                value={layer}
                onChange={(v: string) => setLayer(v as Layer)}
              />
            )}
          </div>
          <div className="rh-story-steps">
            {STEPS.map((k) => (
              <div key={k} data-step={k} ref={(el) => { stepRefs.current[k] = el; }} className={step === k ? 'rh-step rh-step--on' : 'rh-step'}>
                <span className="text-sm-semibold rh-eyebrow">{STEP_META[k].label}</span>
                <h3 className="display-sm-semibold rh-h3">{STEP_META[k].title}</h3>
                <p className="text-md-regular rh-muted rh-para">{legendFor(k)}</p>
                {k === 'integrated' ? (
                  <div className="rh-table-wrap">
                    <DS.Table
                      title="Border crossings"
                      badge={`${crossings.length}`}
                      columns={[
                        { key: 'name', title: 'Crossing' },
                        { key: 'neighbour', title: 'Leads to' },
                        { key: 'mode', title: 'Mode', render: (b: Crossing) => (b.mode === 'causeway' ? 'Causeway' : b.mode === 'road-rail-planned' ? 'Road; rail planned' : 'Road') },
                        { key: 'km', title: 'From Riyadh', render: (b: Crossing) => `${b.km.toLocaleString()} km · ${fmtH(driveHours(b.km))} est.` },
                      ]}
                      rows={crossings}
                    />
                  </div>
                ) : (
                  <dl className="rh-statline">
                    {(k === 'digital' ? DIGITAL_FIGURES : CONNECTIVITY_FIGURES).map((f) => (
                      <div key={f.label} className="rh-stat">
                        <dt className="display-xs-semibold">{f.value}</dt>
                        <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
                      </div>
                    ))}
                  </dl>
                )}
                {k !== 'integrated' && (
                  <div className="rh-relevance">
                    {MODE_RELEVANCE[k].map((r) => (
                      <p key={r.who} className="text-md-regular rh-muted rh-para">
                        <b className="rh-strong">{r.who}.</b> {r.why}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-xs-regular rh-tertiary rh-para">
                  {k === 'integrated'
                    ? 'Roads and rail are drawn as straight corridors between known cities and border posts, not surveyed alignments; distances and drive times are great-circle estimates until MoT, SAR, Mawani, GACA and ZATCA records replace them.'
                    : k === 'air' ? 'Flight times are computed from distance, not schedules; the two rings are the published reach figures. GACA scheduled times per city pair replace the estimates once supplied.' : ''}
                </p>
                <Sideways DS={DS} items={linksFor(k)} />
                {(rowsFor(k).length > 0 || k === 'digital') && (
                  <DS.Button hierarchy="link-gray" size="sm" iconLeading={details === k ? 'chevron-up' : 'chevron-down'} onClick={() => setDetails(details === k ? null : k)}>
                    {details === k ? 'Hide the records' : 'Open the records'}
                  </DS.Button>
                )}
              </div>
            ))}
          </div>
        </div>
        {details === 'digital' && (
          <div className="rh-table-wrap">
            <DS.Table
              title="Digital nodes"
              badge={`${DIGITAL_NODES.length}`}
              columns={[
                { key: 'name', title: 'Location' },
                { key: 'kind', title: 'Type', render: (d: (typeof DIGITAL_NODES)[number]) => (d.kind === 'landing' ? 'Subsea landing city' : d.kind === 'cloud' ? 'Cloud region' : 'Data centre, planned') },
                { key: 'note', title: 'Note' },
                { key: 'status', title: 'Data status', render: (d: (typeof DIGITAL_NODES)[number]) => <SourceLine DS={DS} p={d} badge /> },
              ]}
              rows={DIGITAL_NODES}
            />
          </div>
        )}
        {details && details !== 'digital' && rowsFor(details).length > 0 && (
          <div className="rh-table-wrap">
            <DS.Table
              title={details === 'integrated' ? 'Ports, airports and corridors' : details === 'sea' ? 'Ports' : details === 'air' ? 'Airports' : 'Land corridors and rail'}
              badge={`${rowsFor(details).length}`}
              columns={[
                { key: 'name', title: 'Node' },
                { key: 'location', title: 'Location' },
                { key: 'capacity', title: 'Capacity' },
                { key: 'transit', title: 'Transit to your markets' },
                { key: 'status', title: 'Data status', render: (r: Node) => <SourceLine DS={DS} p={r} badge /> },
              ]}
              rows={rowsFor(details)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
