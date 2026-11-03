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
export interface GlobePoint extends LatLon { id: string; name: string; selected?: boolean; kind?: 'hub' | 'market' | 'port' | 'airport' | 'city' | 'border'; labelAt?: 'right' | 'left' | 'above' | 'below'; sub?: string; title?: string }
export interface GlobeArc { from: LatLon; to: LatLon; dashed?: boolean }
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
  view, onViewChange, onHomeClick, focused = false,
}: {
  points: GlobePoint[]; arcs: GlobeArc[]; rings: GlobeRing[]; lines?: GlobeLine[]; size?: number;
  homeCountryId?: string; selectedCountryIds?: string[]; neighbourCountryIds?: string[];
  view: GlobeView; onViewChange: (v: GlobeView) => void; onHomeClick?: () => void; focused?: boolean;
}) {
  const [cur, setCur] = React.useState<GlobeView>(view);
  const [hiRes, setHiRes] = React.useState<Countries | null>(countries50);
  React.useEffect(() => { if (focused && !hiRes) load50().then(setHiRes).catch(() => undefined); }, [focused, hiRes]);
  const COUNTRIES = focused && hiRes ? hiRes : COUNTRIES_110;
  const [hover, setHover] = React.useState<string | null>(null);
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

  const projection = React.useMemo(() => geoOrthographic().translate([size / 2, size / 2]).scale(R * cur.zoom).rotate([-cur.lon, -cur.lat]).clipAngle(90), [size, R, cur]);
  const path = React.useMemo(() => geoPath(projection), [projection]);
  const sel = new Set(selectedCountryIds), nb = new Set(neighbourCountryIds);
  const visible = (lon: number, lat: number) => geoDistance([lon, lat], [cur.lon, cur.lat]) < Math.PI / 2;
  const onScreen = (q: [number, number] | null) => !!q && q[0] > -40 && q[0] < size + 40 && q[1] > -40 && q[1] < size + 40;

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, v: cur, moved: false }; };
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
          {arcs.map((a, i) => <path key={i} d={arcPath(a)} className={a.dashed ? 'rh-globe-arc rh-globe-arc--dashed' : 'rh-globe-arc'} />)}
        </g>
        <g className="rh-globe-points">
          {points.map((p) => {
            if (!visible(p.lon, p.lat)) return null;
            const q = projection([p.lon, p.lat]);
            if (!onScreen(q)) return null;
            const kind = p.kind ?? 'market';
            const cls = `rh-globe-pt rh-globe-pt--${kind}${p.selected ? ' rh-globe-pt--on' : ''}`;
            const show = (kind !== 'market' || p.selected) && p.name !== '';
            const r = kind === 'hub' ? 5 : kind === 'city' ? 3.5 : kind === 'border' ? 4 : p.selected ? 4.5 : 3;
            return (
              <g key={p.id} transform={`translate(${q![0].toFixed(1)} ${q![1].toFixed(1)})`}>
                {kind === 'hub' && <circle r={10} className="rh-globe-pt-halo" />}
                {kind === 'border' ? <rect x={-4} y={-4} width={8} height={8} transform="rotate(45)" className={cls}><title>{p.title ?? p.name}</title></rect> : <circle r={r} className={cls}><title>{p.title ?? p.name}</title></circle>}
                {show && (
                  <text
                    x={p.labelAt === 'left' ? -9 : p.labelAt === 'above' || p.labelAt === 'below' ? 0 : 9}
                    y={p.labelAt === 'above' ? -10 : p.labelAt === 'below' ? 16 : 4}
                    textAnchor={p.labelAt === 'left' ? 'end' : p.labelAt === 'above' || p.labelAt === 'below' ? 'middle' : 'start'}
                    className={kind === 'hub' ? 'text-sm-semibold rh-globe-label rh-globe-label--hub' : 'text-xs-medium rh-globe-label'}
                  >
                    {p.name}
                    {p.sub && <tspan className="rh-globe-sub"> {p.sub}</tspan>}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="rh-globe-foot text-xs-regular">
        <span>{hover ?? (focused ? `Corridors are schematic, drawn between known cities and border posts. Boundaries: Natural Earth 1:${hiRes ? '50' : '110'}m. Drag to pan.` : (rings.length ? `Dotted rings: ${rings.map((r) => r.label).join(' and ')}. ` : '') + 'Click Saudi Arabia for its logistics network. Boundaries: Natural Earth 1:110m.')}</span>
      </div>
    </div>
  );
}
