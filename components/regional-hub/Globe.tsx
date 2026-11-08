'use client';

import * as React from 'react';
import { geoOrthographic, geoPath, geoGraticule10, geoCircle, geoInterpolate, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import worldTopo from 'world-atlas/countries-110m.json';

/**
 * Real-world globe: Natural Earth 110m country polygons (world-atlas) rendered
 * with d3-geo's orthographic projection, which clips land and lines at the
 * horizon correctly. Every colour is a design-system token (globals.css).
 *
 * Two views. Region: reach rings (animated), hubs, markets and arcs. Focus:
 * clicking Saudi Arabia zooms in and shows the national logistics layer
 * (roads, rail, planned rail, ports, airports, border crossings to each
 * neighbour). The zoom is a short functional transition; both the ring pulse
 * and the zoom stop under prefers-reduced-motion.
 *
 * The design system has no map component; this is a composed candidate addition.
 */

export type LatLon = { lat: number; lon: number };
export interface GlobePoint extends LatLon { id: string; name: string; selected?: boolean; pulse?: boolean; kind?: 'hub' | 'market' | 'port' | 'airport' | 'city' | 'border' | 'centre' | 'zone'; labelAt?: 'right' | 'left' | 'above' | 'below'; sub?: string; title?: string }
export interface GlobeArc { from: LatLon; to: LatLon; dashed?: boolean; label?: string; plane?: boolean; vehicle?: 'plane' | 'ship' | 'truck'; hours?: number; thin?: boolean }

/* Small aircraft silhouette pointing along +x; moved along the arc with SMIL animateMotion. */
const ANCHOR = 'M0,-6.5 a2,2 0 1,0 0.01,0 M0,-4.5 L0,6.5 M-4.5,0.5 L4.5,0.5 M-6.5,2.5 a6.5,5.5 0 0,0 13,0';
const FACTORY = 'M-7,6 L-7,-1.5 L-2.5,1 L-2.5,-1.5 L2,1 L2,-1.5 L6.5,1 L6.5,-6.5 L4,-6.5 L4,-3 L2,-3 L2,-6.5 L-0.5,-6.5 L-0.5,-3 L-2.5,-3 Z';
const SHIP = 'M-9,-1 L9,-1 L6,3 L-7,3 Z M-4,-5 L3,-5 L3,-1 L-4,-1 Z M0,-8 L1,-8 L1,-5 L0,-5 Z';
const TRUCK = 'M-9,-4 L2,-4 L2,3 L-9,3 Z M2,-2 L7,-2 L9,1 L9,3 L2,3 Z M-6,5 a1.6,1.6 0 1,0 0.01,0 Z M5,5 a1.6,1.6 0 1,0 0.01,0 Z';
const PLANE = 'M-7,-1.2 L1.5,-1.2 L5.5,-4.5 L7.5,-4.5 L4.5,-0.3 L7.5,3.9 L5.5,3.9 L1.5,0.6 L-7,0.6 L-8.5,2.6 L-9.5,2.6 L-8,-0.3 L-9.5,-3.2 L-8.5,-3.2 L-7,-1.2 Z';
export interface GlobeRing extends LatLon { km: number; label: string }
export interface GlobeLine { id: string; kind: 'road' | 'rail' | 'rail-planned'; points: [number, number][]; name: string }

const R_EARTH = 6371;
export const greatCircleKm = (a: LatLon, b: LatLon) => geoDistance([a.lon, a.lat], [b.lon, b.lat]) * R_EARTH;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = worldTopo as any;
type Countries = FeatureCollection<Geometry, { name: string }>;
const COUNTRIES_110 = feature(topo, topo.objects.countries) as unknown as Countries;
let countries50: Countries | null = null;
/* 1:50m boundaries load only when the visitor zooms in (about 5x the data of 110m). */
const load50 = () => import('world-atlas/countries-50m.json').then((m) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (m as any).default ?? m;
  countries50 = feature(t, t.objects.countries) as unknown as Countries;
  return countries50;
});
const GRATICULE = geoGraticule10();
const toDeg = (km: number) => (km / R_EARTH) * (180 / Math.PI);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

export interface GlobeView { lat: number; lon: number; zoom: number }

export function Globe({
  points, arcs, rings, lines = [], size = 720, homeCountryId = '682', selectedCountryIds = [], neighbourCountryIds = [],
  view, onViewChange, onHomeClick, focused = false, autoRotate = false, showFoot = true, onPointClick, pointCard,
}: {
  points: GlobePoint[]; arcs: GlobeArc[]; rings: GlobeRing[]; lines?: GlobeLine[]; size?: number;
  homeCountryId?: string; selectedCountryIds?: string[]; neighbourCountryIds?: string[];
  view: GlobeView; onViewChange: (v: GlobeView) => void; onHomeClick?: () => void; focused?: boolean; autoRotate?: boolean; showFoot?: boolean; onPointClick?: (p: GlobePoint) => void; pointCard?: (p: GlobePoint) => { title: string; description?: string } | null;
}) {
  const [cur, setCur] = React.useState<GlobeView>(view);
  const [hiRes, setHiRes] = React.useState<Countries | null>(countries50);
  React.useEffect(() => { if (focused && !hiRes) load50().then(setHiRes).catch(() => undefined); }, [focused, hiRes]);
  const COUNTRIES = focused && hiRes ? hiRes : COUNTRIES_110;
  const [hover, setHover] = React.useState<string | null>(null);
  const [hoverPt, setHoverPt] = React.useState<{ p: GlobePoint; x: number; y: number } | null>(null);
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => { try { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { /* no matchMedia */ } }, []);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const drag = React.useRef<{ x: number; y: number; v: GlobeView; moved: boolean } | null>(null);
  const anim = React.useRef<number | null>(null);
  const R = size / 2 - 12;

  /* Animate to the requested view (functional transition, 600 ms, none under reduced motion). */
  React.useEffect(() => {
    if (anim.current) cancelAnimationFrame(anim.current);
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const from = { ...cur };
    if (reduced || (from.lat === view.lat && from.lon === view.lon && from.zoom === view.zoom)) { setCur(view); return; }
    const t0 = performance.now();
    const step = (t: number) => {
      const k = ease(Math.min(1, (t - t0) / 600));
      setCur({ lat: from.lat + (view.lat - from.lat) * k, lon: from.lon + (view.lon - from.lon) * k, zoom: from.zoom + (view.zoom - from.zoom) * k });
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
    return () => { if (anim.current) cancelAnimationFrame(anim.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.lat, view.lon, view.zoom]);

  /* Slow drift for the hero (about one degree every two seconds); stops on the first drag and under reduced motion. */
  const [drifting, setDrifting] = React.useState(autoRotate);
  React.useEffect(() => {
    if (!drifting) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setDrifting(false); return; }
    let raf = 0; let last = performance.now();
    const tick = (t: number) => { const dt = (t - last) / 1000; last = t; setCur((c) => ({ ...c, lon: c.lon + dt * 0.5 })); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drifting]);

  const projection = React.useMemo(() => geoOrthographic().translate([size / 2, size / 2]).scale(R * cur.zoom).rotate([-cur.lon, -cur.lat]).clipAngle(90), [size, R, cur]);
  const path = React.useMemo(() => geoPath(projection), [projection]);
  const sel = new Set(selectedCountryIds), nb = new Set(neighbourCountryIds);
  const visible = (lon: number, lat: number) => geoDistance([lon, lat], [cur.lon, cur.lat]) < Math.PI / 2;
  const onScreen = (q: [number, number] | null) => !!q && q[0] > -40 && q[0] < size + 40 && q[1] > -40 && q[1] < size + 40;

  const onDown = (e: React.PointerEvent) => { setDrifting(false); drag.current = { x: e.clientX, y: e.clientY, v: cur, moved: false }; };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    const k = 0.25 / cur.zoom;
    const v = { lon: drag.current.v.lon - dx * k, lat: Math.max(-80, Math.min(80, drag.current.v.lat + dy * k)), zoom: cur.zoom };
    setCur(v);
  };
  const onUp = () => { if (drag.current?.moved) onViewChange(cur); drag.current = null; };
  const onKey = (e: React.KeyboardEvent) => {
    const step = 5 / cur.zoom;
    if (e.key === 'ArrowLeft') onViewChange({ ...cur, lon: cur.lon - step });
    else if (e.key === 'ArrowRight') onViewChange({ ...cur, lon: cur.lon + step });
    else if (e.key === 'ArrowUp') onViewChange({ ...cur, lat: Math.min(80, cur.lat + step) });
    else if (e.key === 'ArrowDown') onViewChange({ ...cur, lat: Math.max(-80, cur.lat - step) });
    else return;
    e.preventDefault();
  };

  const arcPath = (a: GlobeArc) => {
    const interp = geoInterpolate([a.from.lon, a.from.lat], [a.to.lon, a.to.lat]);
    return path({ type: 'LineString', coordinates: Array.from({ length: 65 }, (_, i) => interp(i / 64)) }) ?? '';
  };
  const linePath = (l: GlobeLine) => {
    const coords: [number, number][] = [];
    for (let i = 0; i < l.points.length - 1; i++) {
      const interp = geoInterpolate(l.points[i], l.points[i + 1]);
      for (let j = 0; j < 16; j++) coords.push(interp(j / 16));
    }
    coords.push(l.points[l.points.length - 1]);
    return path({ type: 'LineString', coordinates: coords }) ?? '';
  };

  const home = points.find((p) => p.kind === 'hub');

  return (
    <div className={focused ? 'rh-globe-box rh-globe-box--focus' : 'rh-globe-box'}>
      <svg
        className="rh-globe"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        tabIndex={0}
        aria-label={focused ? 'Saudi Arabia logistics map: roads, rail, ports, airports and border crossings to neighbouring countries.' : 'World globe centred on Saudi Arabia showing reach rings, hubs and the selected markets. Click Saudi Arabia to see its logistics network. Drag or use arrow keys to rotate.'}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        <path d={path({ type: 'Sphere' }) ?? ''} className="rh-globe-sphere" />
        <path d={path(GRATICULE) ?? ''} className="rh-globe-grat" />
        <g className="rh-globe-land">
          {COUNTRIES.features.map((f) => {
            const id = String(f.id);
            const cls = id === homeCountryId ? 'rh-globe-country rh-globe-country--home' : sel.has(id) ? 'rh-globe-country rh-globe-country--on' : nb.has(id) ? 'rh-globe-country rh-globe-country--nb' : 'rh-globe-country';
            return (
              <path
                key={id}
                d={path(f) ?? ''}
                className={cls}
                onPointerEnter={() => setHover(f.properties.name)}
                onPointerLeave={() => setHover(null)}
                onPointerUp={() => { if (id === homeCountryId && drag.current && !drag.current.moved && onHomeClick) onHomeClick(); }}
              >
                <title>{id === homeCountryId && !focused ? `${f.properties.name}: click to see roads, rail, ports and border crossings` : f.properties.name}</title>
              </path>
            );
          })}
        </g>
        {!focused && home && (
          <g className="rh-globe-rings">
            {rings.map((r, i) => <path key={r.label} d={path(geoCircle().center([r.lon, r.lat]).radius(toDeg(r.km))()) ?? ''} style={{ animationDelay: `${i * 0.4}s` }} />)}
            {rings.length > 0 && (() => {
              const q = projection([home.lon, home.lat]);
              if (!q || !visible(home.lon, home.lat)) return null;
              const maxR = projection([home.lon + toDeg(rings[rings.length - 1].km), home.lat]);
              const px = maxR ? Math.abs(maxR[0] - q[0]) : R * 0.6;
              return (
                <g className="rh-globe-pulse" transform={`translate(${q[0]} ${q[1]})`}>
                  <circle r={px} className="rh-globe-pulse-ring" />
                  <circle r={px} className="rh-globe-pulse-ring rh-globe-pulse-ring--2" />
                </g>
              );
            })()}
          </g>
        )}
        <g className="rh-globe-lines">
          {lines.map((l) => <path key={l.id} d={linePath(l)} className={`rh-globe-line rh-globe-line--${l.kind}`}><title>{l.name}</title></path>)}
        </g>
        <g className="rh-globe-arcs">
          {(() => { const placed: { x: number; y: number; w: number }[] = []; return arcs.map((a, i) => {
            const d = arcPath(a);
            if (!d) return null;
            const id = `rh-arc-${uid}-${i}`;
            const interp = geoInterpolate([a.from.lon, a.from.lat], [a.to.lon, a.to.lat]);
            const midLL = interp(0.7);
            const mid = visible(midLL[0], midLL[1]) ? projection(midLL) : null;
            const vehicle = a.vehicle ?? (a.plane ? 'plane' : undefined);
            const dur = vehicle === 'ship' ? 14 : vehicle === 'truck' ? 9 : Math.max(4, (a.hours ?? 4) * 1.8);
            const shape = vehicle === 'ship' ? SHIP : vehicle === 'truck' ? TRUCK : PLANE;
            return (
              <g key={i} className={vehicle ? `rh-globe-arcg rh-globe-arcg--${vehicle}` : 'rh-globe-arcg'}>
                {vehicle && !a.thin && <path d={d} className="rh-globe-arc-glow" />}
                <path id={id} d={d} pathLength={1} className={`rh-globe-arc${a.dashed ? ' rh-globe-arc--dashed' : ''}${vehicle ? ' rh-globe-arc--air' : ''}${a.thin ? ' rh-globe-arc--thin' : ''}`} />
                {vehicle && !reduced && (
                  <g className={`rh-globe-plane rh-globe-vehicle--${vehicle}`}>
                    <path d={shape} transform={vehicle === 'plane' ? 'scale(1.5)' : 'scale(1.2)'} />
                    <animateMotion dur={`${dur}s`} repeatCount="indefinite" rotate={vehicle === 'ship' ? '0' : 'auto'} begin={`-${((i * 0.37) % 1) * dur}s`} calcMode="linear">
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </g>
                )}
                {a.label && mid && onScreen(mid) && (() => { const w = a.label.length * 7.2 + 16; const hub = points.find((pt) => pt.kind === 'hub'); const hq = hub ? projection([hub.lon, hub.lat]) : null; const nearHub = hq ? Math.hypot(hq[0] - mid[0], hq[1] - mid[1]) < 90 : false; const hit = nearHub || placed.some((q) => Math.abs(q.x - mid[0]) < (q.w + w) / 2 + 6 && Math.abs(q.y - mid[1]) < 22); if (hit) return null; placed.push({ x: mid[0], y: mid[1], w }); return true; })() && (
                  <g className="rh-globe-pill" transform={`translate(${mid[0].toFixed(1)} ${mid[1].toFixed(1)})`}>
                    <rect x={-(a.label.length * 3.6 + 8)} y={-9} width={a.label.length * 7.2 + 16} height={18} rx={9} />
                    <text y={4} textAnchor="middle" className="text-xs-semibold">{a.label}</text>
                  </g>
                )}
              </g>
            );
          }); })()}
        </g>
        <g className="rh-globe-points">
          {(() => { const used: { x: number; y: number }[] = []; return points.map((p) => {
            if (!visible(p.lon, p.lat)) return null;
            const q = projection([p.lon, p.lat]);
            if (!onScreen(q)) return null;
            const kind = p.kind ?? 'market';
            const cls = `rh-globe-pt rh-globe-pt--${kind}${p.selected ? ' rh-globe-pt--on' : ''}`;
            let show = (kind !== 'market' || p.selected) && p.name !== '';
            if (show && (kind === 'market' || kind === 'centre' || kind === 'port') && used.some((u) => Math.abs(u.x - q![0]) < 70 && Math.abs(u.y - q![1]) < 14)) show = false;
            if (show && kind !== 'hub') used.push({ x: q![0], y: q![1] });
            const r = kind === 'hub' ? 5 : kind === 'city' ? 3.5 : kind === 'border' ? 4 : kind === 'centre' ? 3.5 : p.selected ? 4.5 : 3;
            return (
              <g
                key={p.id}
                transform={`translate(${q![0].toFixed(1)} ${q![1].toFixed(1)})`}
                className={onPointClick && kind === 'market' ? 'rh-globe-ptg rh-globe-ptg--click' : 'rh-globe-ptg'}
                onPointerEnter={() => pointCard && setHoverPt({ p, x: q![0], y: q![1] })}
                onPointerLeave={() => setHoverPt(null)}
                onPointerUp={() => { if (onPointClick && kind === 'market' && drag.current && !drag.current.moved) onPointClick(p); }}
              >
                {kind === 'hub' && <circle r={10} className="rh-globe-pt-halo" />}
                {p.pulse && !reduced && <><circle r={14} className="rh-globe-pt-pulse" /><circle r={14} className="rh-globe-pt-pulse rh-globe-pt-pulse--2" /></>}
                {kind === 'border' ? <rect x={-4} y={-4} width={8} height={8} transform="rotate(45)" className={cls}><title>{p.title ?? p.name}</title></rect>
                  : focused && (kind === 'port' || kind === 'airport' || kind === 'zone') ? (
                    <g className={`rh-glyph rh-glyph--${kind}`}>
                      {kind === 'zone' ? <rect x={-7.5} y={-7.5} width={15} height={15} rx={3.5} /> : <circle r={7.5} />}
                      {kind === 'port' ? <path d={ANCHOR} transform="scale(0.8)" className="rh-glyph-stroke" /> : kind === 'airport' ? <path d={PLANE} transform="scale(0.7) rotate(-45)" className="rh-glyph-fill" /> : <path d={FACTORY} transform="scale(0.8)" className="rh-glyph-fill" />}
                      <title>{p.title ?? p.name}</title>
                    </g>
                  ) : <circle r={r} className={cls}><title>{p.title ?? p.name}</title></circle>}
                {show && (
                  <text
                    x={p.labelAt === 'left' ? (focused && kind !== 'city' && kind !== 'hub' ? -13 : -9) : p.labelAt === 'above' || p.labelAt === 'below' ? 0 : (focused && kind !== 'city' && kind !== 'hub' ? 13 : 9)}
                    y={p.labelAt === 'above' ? (focused && kind !== 'city' && kind !== 'hub' ? -13 : -10) : p.labelAt === 'below' ? (focused && kind !== 'city' && kind !== 'hub' ? 20 : 16) : 4}
                    textAnchor={p.labelAt === 'left' ? 'end' : p.labelAt === 'above' || p.labelAt === 'below' ? 'middle' : 'start'}
                    className={kind === 'hub' ? 'text-sm-semibold rh-globe-label rh-globe-label--hub' : 'text-xs-medium rh-globe-label'}
                  >
                    {p.name}
                    {p.sub && <tspan className="rh-globe-sub"> {p.sub}</tspan>}
                  </text>
                )}
              </g>
            );
          }); })()}
        </g>
      </svg>
      {hoverPt && pointCard && pointCard(hoverPt.p) && (
        <div className="rh-globe-card" style={{ left: `${(hoverPt.x / size) * 100}%`, top: `${(hoverPt.y / size) * 100}%` }}>
          <span className="text-sm-semibold">{pointCard(hoverPt.p)!.title}</span>
          {pointCard(hoverPt.p)!.description && <span className="text-xs-regular rh-globe-card-desc">{pointCard(hoverPt.p)!.description}</span>}
        </div>
      )}
      {showFoot && <div className="rh-globe-foot text-xs-regular">
        <span>{hover ?? (focused ? `Corridors are schematic, drawn between known cities and border posts. Boundaries: Natural Earth 1:${hiRes ? '50' : '110'}m. Drag to pan.` : (rings.length ? `Dotted rings: ${rings.map((r) => r.label).join(' and ')}. ` : '') + 'Click Saudi Arabia for its logistics network. Boundaries: Natural Earth 1:110m.')}</span>
      </div>}
    </div>
  );
}

/**
 * MiniMap: a non-interactive map tile centred on one location, drawn from the
 * same Natural Earth geometry (1:50m, loaded on demand). Used as the image of
 * a zone or port: real coastline and borders, a marker, nothing invented.
 */
export function MiniMap({ lat, lon, zoom = 18, size = 420, label }: { lat: number; lon: number; zoom?: number; size?: number; label?: string }) {
  const [hi, setHi] = React.useState<Countries | null>(countries50);
  React.useEffect(() => { if (!hi) load50().then(setHi).catch(() => undefined); }, [hi]);
  const R = size / 2;
  const projection = React.useMemo(() => geoOrthographic().translate([size / 2, size / 2]).scale(R * zoom).rotate([-lon, -lat]).clipAngle(90), [size, R, zoom, lat, lon]);
  const path = React.useMemo(() => geoPath(projection), [projection]);
  const data = hi ?? COUNTRIES_110;
  const q = projection([lon, lat]);
  return (
    <svg className="rh-minimap" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ? `Map of ${label}` : 'Map'}>
      <rect width={size} height={size} className="rh-minimap-sea" />
      <g className="rh-minimap-land">
        {data.features.map((f) => <path key={String(f.id)} d={path(f) ?? ''} className={String(f.id) === '682' ? 'rh-minimap-country rh-minimap-country--home' : 'rh-minimap-country'} />)}
      </g>
      <path d={path(GRATICULE) ?? ''} className="rh-minimap-grat" />
      {q && (
        <g transform={`translate(${q[0]} ${q[1]})`}>
          <circle r={14} className="rh-minimap-halo" />
          <circle r={5} className="rh-minimap-pin" />
        </g>
      )}
    </svg>
  );
}

/* Country map for section 04: Saudi Arabia with its two coasts and the capital.
 * Pins are the locations; the active coast draws short dashed reach lines in
 * the direction its ports face. Boundaries: Natural Earth. */
export interface CoastPin extends LatLon { id: string; name: string; coast: string; labelAt?: 'left' | 'right' | 'above' | 'below' }
export function CoastMap({ pins, active, onPick, reach = [], size = 560, tone = 'dark' }: { pins: CoastPin[]; active: string; onPick?: (coast: string) => void; reach?: { from: LatLon; to: LatLon }[]; size?: number; tone?: 'dark' | 'light' }) {
  const gid = React.useId().replace(/:/g, '');
  const [hi, setHi] = React.useState<Countries | null>(countries50);
  React.useEffect(() => { if (!hi) load50().then(setHi).catch(() => undefined); }, [hi]);
  const projection = React.useMemo(() => geoOrthographic().translate([size / 2, size / 2]).scale(size * 2.05).rotate([-45.2, -24.2]).clipAngle(90), [size]);
  const path = React.useMemo(() => geoPath(projection), [projection]);
  const data = hi ?? COUNTRIES_110;
  return (
    <svg className={`rh-coastmap rh-coastmap--${tone}`} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Map of Saudi Arabia with the Red Sea coast, the Arabian Gulf coast and Riyadh">
      <defs>
        <radialGradient id={`sea-${gid}`} cx="50%" cy="50%" r="70%">{tone === 'dark' ? <><stop offset="0%" stopColor="#16242a" /><stop offset="100%" stopColor="#0a1113" /></> : <><stop offset="0%" stopColor="#e3f3f5" /><stop offset="100%" stopColor="#cfe7eb" /></>}</radialGradient>
      </defs>
      <rect width={size} height={size} fill={`url(#sea-${gid})`} />
      <g>
        {data.features.map((f) => <path key={String(f.id)} d={path(f) ?? ''} className={String(f.id) === '682' ? 'rh-coast-country rh-coast-country--home' : 'rh-coast-country'} />)}
      </g>
      {reach.map((r, i) => {
        const d = path({ type: 'LineString', coordinates: [[r.from.lon, r.from.lat], [r.to.lon, r.to.lat]] });
        return d ? <path key={i} d={d} className="rh-coast-reach" /> : null;
      })}
      {pins.map((p) => {
        const q = projection([p.lon, p.lat]); if (!q) return null;
        const on = p.coast === active;
        const dx = p.labelAt === 'left' ? -12 : p.labelAt === 'above' || p.labelAt === 'below' ? 0 : 12;
        const dy = p.labelAt === 'above' ? -12 : p.labelAt === 'below' ? 20 : 4;
        return (
          <g key={p.id} transform={`translate(${q[0]} ${q[1]})`} className={on ? 'rh-coast-pin rh-coast-pin--on' : 'rh-coast-pin'} onClick={() => onPick?.(p.coast)} role={onPick ? 'button' : undefined} tabIndex={onPick ? 0 : undefined} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPick?.(p.coast); }}>
            <title>{p.name}</title>
            {on && <circle r={16} className="rh-coast-halo" />}
            <circle r={on ? 6 : 4.5} className="rh-coast-dot" />
            <text x={dx} y={dy} textAnchor={p.labelAt === 'left' ? 'end' : p.labelAt === 'above' || p.labelAt === 'below' ? 'middle' : 'start'} className="rh-coast-label">{p.name}</text>
          </g>
        );
      })}
    </svg>
  );
}
