'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { CONNECTIVITY_FIGURES, CORRIDORS, DIGITAL_FIGURES, DIGITAL_NODES, HUB_CITIES, LAND_PORTS, MARKETS, MODE_RELEVANCE, NODES, REACH_RINGS, SAUDI_CITIES, type Node } from '@/data/regional-hub';
import { Globe, greatCircleKm, type GlobeArc, type GlobeLine, type GlobePoint, type GlobeView } from './Globe';
import { Sideways, SourceLine, marketNames, type HubContext } from './shared';

type Mode = 'air' | 'sea' | 'ground' | 'digital';
type Layer = 'all' | 'road' | 'rail' | 'ports';

/* Estimated travel time from great-circle distance. Status "estimate" until the
 * owning authority publishes a figure per pair. */
const flightHours = (km: number) => km / 850 + 0.5;
const driveHours = (km: number) => (km * 1.25) / 80;
const fmtH = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : `${h.toFixed(1).replace(/\.0$/, '')} h`);

const REGION_VIEW: GlobeView = { lat: 22, lon: 42, zoom: 1 };
const SAUDI_VIEW: GlobeView = { lat: 24, lon: 45, zoom: 3.4 };
const DIGITAL_VIEW: GlobeView = { lat: 24, lon: 44, zoom: 2.2 };
const NEIGHBOURS = ['784', '634', '414', '512', '400', '368', '887', '048'];

/** Band 3: how strongly Saudi Arabia is connected, by air, sea and ground, on a real-world globe. */
export function ConnectivityBand({ DS, ctx }: { DS: DS; ctx: HubContext }) {
  const [mode, setMode] = React.useState<Mode>('air');
  const [layer, setLayer] = React.useState<Layer>('all');
  const [focused, setFocused] = React.useState(false);
  const [view, setView] = React.useState<GlobeView>(REGION_VIEW);
  const [details, setDetails] = React.useState(false);

  const selected = MARKETS.filter((m) => ctx.markets.includes(m.code));
  const shown = selected.length ? selected : MARKETS;
  const riyadh = HUB_CITIES[0];
  const ground = new Set(['AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'IQ']);
  const seaMarkets = shown.filter((m) => !['KW', 'JO', 'IQ'].includes(m.code));

  const enterFocus = () => { setFocused(true); setView(SAUDI_VIEW); };
  const exitFocus = () => { setFocused(false); setView(mode === 'digital' ? DIGITAL_VIEW : REGION_VIEW); };

  /* Region view: hubs, markets, arcs, rings. */
  const regionPoints: GlobePoint[] = [
    ...HUB_CITIES.map((h) => ({ ...h, kind: 'hub' as const, labelAt: (h.id === 'jed' ? 'left' : h.id === 'dmm' ? 'above' : 'below') as 'left' | 'above' | 'below' })),
    ...(mode === 'sea' ? NODES.filter((n) => n.mode === 'sea').map((n) => ({ id: n.id, name: n.name.replace(' Port', ''), lat: n.lat, lon: n.lon, kind: 'port' as const })) : []),
    ...(mode === 'digital' ? DIGITAL_NODES.map((d) => ({ id: d.id, name: d.name, lat: d.lat, lon: d.lon, kind: (d.kind === 'landing' ? 'port' : 'airport') as 'port' | 'airport', title: `${d.name}: ${d.note}`, labelAt: (d.lon < 44 ? 'left' : 'right') as 'left' | 'right', sub: d.kind === 'landing' ? '(landing)' : d.kind === 'cloud' ? '(cloud)' : '(planned)' })) : []),
    ...MARKETS.map((m) => {
      const on = ctx.markets.includes(m.code);
      const t = mode === 'air' ? ` · ${fmtH(flightHours(greatCircleKm(riyadh, m)))}` : mode === 'ground' && ground.has(m.code) ? ` · ${fmtH(driveHours(greatCircleKm(riyadh, m)))}` : '';
      return { id: m.code, name: on ? m.city + t : m.city, lat: m.lat, lon: m.lon, kind: 'market' as const, selected: on, labelAt: (m.lon < riyadh.lon - 8 ? 'left' : 'right') as 'left' | 'right' };
    }),
  ];
  const regionArcs: GlobeArc[] =
    mode === 'air' ? shown.map((m) => ({ from: riyadh, to: m }))
      : mode === 'ground' ? shown.filter((m) => ground.has(m.code)).map((m) => ({ from: riyadh, to: m, dashed: true }))
        : mode === 'digital' ? [] : seaMarkets.map((m) => ({ from: m.lon < 44 ? { lat: 21.47, lon: 39.17 } : { lat: 26.47, lon: 50.2 }, to: m, dashed: true }));
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

  const legend = focused
    ? 'Roads in brand, operating rail dashed, planned rail dotted, ports (blue) and airports (orange) as points, border crossings as diamonds labelled with the neighbour they lead to. Hover any point for its name; the Ports and airports layer labels them all. Corridors are schematic; surveyed alignments come from MoT and SAR.'
    : mode === 'air'
      ? 'Arcs from Riyadh to each selected market with estimated flight time (great-circle distance at about 850 km/h plus 30 minutes). Pulsing rings are the published 4-hour and 8-hour flight reach.'
      : mode === 'sea'
        ? 'Red Sea ports serve Africa, Europe and the Levant; Arabian Gulf ports serve the GCC and Asia. Transit days per port pair are not yet published, so no time is shown.'
        : mode === 'digital'
          ? 'Subsea landing cities on both coasts (blue), cloud and data-centre locations (orange). No cable routes are drawn: cable names, capacities and provider region status come from CST and the providers before they appear here.'
          : 'Road corridors to the GCC, Jordan and Iraq from Riyadh with estimated drive time (road distance taken as 1.25 times great-circle at 80 km/h). Click Saudi Arabia to see the national network.';

  const rows = focused ? NODES : mode === 'digital' ? [] : NODES.filter((n) => (mode === 'ground' ? n.mode === 'land' : n.mode === mode));
  const crossings = LAND_PORTS.map((b) => ({ ...b, km: Math.round(greatCircleKm(riyadh, b)) }));
  type Crossing = (typeof crossings)[number];

  return (
    <section id="connectivity" className="rh-band" aria-labelledby="rh-connect">
      <div className="rh-container rh-stack">
        <DS.SectionHeader
          title={focused ? 'Saudi Arabia: roads, rail, ports and borders' : 'Connected by air, land, sea and digital links'}
          supporting={focused ? 'The integrated network: ports, airports, roads, operating and planned rail, and the crossing to every neighbour. Drag to pan.' : `By air, sea, land and digital links to ${marketNames(ctx.markets)}. Transport links are one thing; market access is the section below. Click Saudi Arabia on the globe to open its national network.`}
          tabs={
            focused ? (
              <DS.Tabs
                type="button-border"
                items={[{ label: 'Integrated network', value: 'all' }, { label: 'Roads', value: 'road' }, { label: 'Rail', value: 'rail' }, { label: 'Ports and airports', value: 'ports' }]}
                value={layer}
                onChange={(v: string) => setLayer(v as Layer)}
              />
            ) : (
              <DS.Tabs
                type="button-border"
                items={[{ label: 'Air', value: 'air' }, { label: 'Sea', value: 'sea' }, { label: 'Land', value: 'ground' }, { label: 'Digital', value: 'digital' }]}
                value={mode}
                onChange={(v: string) => { setMode(v as Mode); setView(v === 'digital' ? DIGITAL_VIEW : REGION_VIEW); }}
              />
            )
          }
          actions={
            focused ? (
              <DS.Button hierarchy="secondary-gray" size="md" iconLeading="arrow-left" onClick={exitFocus}>Back to the region</DS.Button>
            ) : (
              <DS.Button hierarchy="secondary-color" size="md" iconLeading="marker-pin-01" onClick={enterFocus}>Open the Saudi network</DS.Button>
            )
          }
        />
        <div className="rh-globe-layout">
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
            />
          </div>
          <div className="rh-stack" style={{ gap: 'var(--spacing-2xl)' }}>
            <p className="text-sm-regular rh-muted" style={{ margin: 0 }}>{legend}</p>
            {focused ? (
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
                {(mode === 'digital' ? DIGITAL_FIGURES : CONNECTIVITY_FIGURES).map((f) => (
                  <div key={f.label} className="rh-stat">
                    <dt className="display-xs-semibold">{f.value}</dt>
                    <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
                  </div>
                ))}
              </dl>
            )}
            {!focused && (
              <div className="rh-stack" style={{ gap: 'var(--spacing-lg)' }}>
                <span className="text-sm-semibold rh-eyebrow">Why it matters to your business</span>
                <div className="rh-relevance">
                  {MODE_RELEVANCE[mode].map((r) => (
                    <p key={r.who} className="text-md-regular rh-muted rh-para">
                      <b className="rh-strong">{r.who}.</b> {r.why}
                    </p>
                  ))}
                </div>
                <Sideways
                  DS={DS}
                  items={
                    mode === 'air'
                      ? [{ label: 'Riyadh logistics zone', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Corporate base route', href: '#routes', icon: 'building-07' }, { label: 'Logistics sector', href: '/sectors/logistics', icon: 'briefcase-01' }]
                      : mode === 'sea'
                        ? [{ label: 'Zones beside ports', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Export route', href: '#routes', icon: 'tool-02' }, { label: 'Agreements and rules of origin', href: '#market-access', icon: 'globe-01' }]
                        : mode === 'ground'
                          ? [{ label: 'Industrial cities', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Distribution route', href: '#routes', icon: 'truck-01' }, { label: 'GCC customs union', href: '#market-access', icon: 'globe-01' }]
                          : [{ label: 'Cloud Computing SEZ', href: '#platforms', icon: 'marker-pin-01' }, { label: 'Digital hub route', href: '#routes', icon: 'server-04' }, { label: 'ICT sector', href: '/sectors/ict', icon: 'briefcase-01' }]
                  }
                />
              </div>
            )}
            <p className="text-xs-regular rh-tertiary" style={{ margin: 0 }}>
              {focused
                ? 'Roads and rail are drawn as straight corridors between known cities and border posts, not surveyed alignments; distances and drive times are great-circle estimates until MoT, SAR, Mawani, GACA and ZATCA records replace them.'
                : mode === 'air'
                  ? 'Flight times are computed from distance, not schedules; the two rings are the published reach figures. GACA scheduled times per city pair replace the estimates once supplied.'
                  : ''}
            </p>
            <div className="rh-actions">
              <DS.Button hierarchy="link-gray" size="md" iconLeading={details ? 'chevron-up' : 'chevron-down'} onClick={() => setDetails(!details)}>
                {details ? 'Hide the records' : 'Open the records'}
              </DS.Button>
              <DS.Button hierarchy="link-color" size="md" href="/regions" iconTrailing="arrow-right">
                Regions and cities
              </DS.Button>
            </div>
          </div>
        </div>
        {details && mode === 'digital' && !focused && (
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
        {details && rows.length > 0 && (
          <div className="rh-table-wrap">
            <DS.Table
              title={focused ? 'Ports, airports and corridors' : mode === 'sea' ? 'Ports' : mode === 'air' ? 'Airports' : 'Land corridors and rail'}
              badge={`${rows.length}`}
              columns={[
                { key: 'name', title: 'Node' },
                { key: 'location', title: 'Location' },
                { key: 'capacity', title: 'Capacity' },
                { key: 'transit', title: 'Transit to your markets' },
                { key: 'status', title: 'Data status', render: (r: Node) => <SourceLine DS={DS} p={r} badge /> },
              ]}
              rows={rows}
            />
          </div>
        )}
      </div>
    </section>
  );
}
