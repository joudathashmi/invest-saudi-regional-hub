'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES, type RouteId } from '@/data/regional-hub';
import { contextQuery } from '@/lib/copilot-context';
import { Details, Reveal, SourceLine, Thread, PURPOSE_LABEL, type HubContext } from './shared';
import { CoastMap, type CoastPin } from './Globe';
import { ROUTE_PHOTOS } from './imagery';

/**
 * 05 Operating model, as a decision path rather than a questionnaire. Pick the
 * model; one screen then shows the path it takes (place, licence, incentive,
 * frameworks, people) as connected nodes, with the locations that fit lit on
 * the map. The establishment steps and the source sit one click below. The
 * selection is the same shared context the hero and the case builder set.
 */
const ALL_PINS: (CoastPin & { platform: string })[] = [
  { id: 'kaec', name: 'KAEC SEZ', coast: '', lat: 22.45, lon: 39.1, labelAt: 'left', platform: 'kaec-sez' },
  { id: 'yanbu', name: 'Yanbu', coast: '', lat: 24.09, lon: 38.06, labelAt: 'left', platform: 'rcjy' },
  { id: 'jazan', name: 'Jazan SEZ', coast: '', lat: 16.95, lon: 42.55, labelAt: 'left', platform: 'jazan-sez' },
  { id: 'rak', name: 'Ras Al-Khair SEZ', coast: '', lat: 27.5, lon: 49.2, labelAt: 'above', platform: 'rak-sez' },
  { id: 'jubail', name: 'Jubail', coast: '', lat: 27.0, lon: 49.65, labelAt: 'right', platform: 'rcjy' },
  { id: 'ilbz', name: 'Riyadh ILBZ', coast: '', lat: 24.95, lon: 46.7, labelAt: 'above', platform: 'ilbz' },
  { id: 'cloud', name: 'Cloud SEZ', coast: '', lat: 24.6, lon: 46.72, labelAt: 'below', platform: 'cloud-sez' },
  { id: 'modon', name: 'MODON cities', coast: '', lat: 21.5, lon: 45.6, labelAt: 'below', platform: 'modon' },
];

export function RoutesBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void }) {
  const selected = ROUTES.find((r) => r.id === ctx.route) ?? ROUTES[0];
  const chosen = Boolean(ctx.route);
  const fitting = PLATFORMS.filter((p) => p.routes.includes(selected.id));
  const pins = ALL_PINS.map((p) => ({ ...p, coast: fitting.some((f) => f.id === p.platform) ? 'fit' : 'other' }));
  const [node, setNode] = React.useState(0);
  React.useEffect(() => { setNode(0); }, [selected.id]);

  const NODES = [
    { k: 'Place', v: fitting.map((p) => p.name.replace('King Abdullah Economic City', 'KAEC').replace('Riyadh Integrated Special Logistics Zone', 'Riyadh ILBZ')).join(', ') || 'Any licensed premises', href: '#platforms', go: 'Choose the coast' },
    { k: 'Licence', v: selected.licence, href: `/how-to-invest/set-up?${contextQuery(ctx, { route: selected.id })}`, go: 'How to set up' },
    { k: 'Incentive', v: selected.incentives[0], href: `/how-to-invest/incentives?${contextQuery(ctx, { route: selected.id })}`, go: 'Check eligibility' },
    { k: 'Frameworks', v: selected.id === 'export' || selected.id === 'logistics' ? 'GCC customs union and GAFTA rules of origin for goods' : 'National licensing in each market; tax treaties where in force', href: '#market-access', go: 'See the frameworks' },
    { k: 'People', v: 'Residency routes and Saudization terms per programme', href: '#talent', go: 'See talent' },
  ];

  return (
    <section id="routes" className="rh-band" aria-labelledby="rh-routes">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <Thread ctx={ctx} />
          <span className="text-sm-semibold rh-eyebrow">05 · Operating model</span>
          <h2 id="rh-routes" className="display-md-semibold rh-h2">{chosen ? `The path for ${PURPOSE_LABEL[selected.id].toLowerCase()}` : 'Five ways to run the region from here'}</h2>
          <p className="text-lg-regular rh-muted rh-para">{chosen ? 'One screen: where it sits, what it is licensed as, what it can claim, which rules carry it across the region, and who runs it. Change the model and the path redraws.' : 'A regional headquarters is one of them. Choose a model and the page draws its path: place, licence, incentive, frameworks and people.'}</p>
        </Reveal>

        <div className="rh-models" role="tablist" aria-label="Operating models">
          {ROUTES.map((r) => (
            <button key={r.id} type="button" role="tab" aria-selected={r.id === selected.id} className={r.id === selected.id ? 'rh-model rh-model--on' : 'rh-model'} onClick={() => onChange({ ...ctx, route: r.id as RouteId })}>
              <DS.FeaturedIcon icon={r.icon} color={r.id === selected.id ? 'brand' : 'gray'} size="md" />
              <span className="text-md-semibold rh-model-title">{r.title.replace(' (Regional Headquarters)', '')}</span>
              <span className="text-sm-regular rh-model-meta">{r.meta}</span>
            </button>
          ))}
        </div>

        <div className="rh-path" key={selected.id}>
          <div className="rh-path-main">
            <p className="text-lg-regular rh-path-why"><span className="rh-strong">Why here.</span> {selected.description} {selected.connectivity}</p>
            <ol className="rh-nodes">
              {NODES.map((n, i) => (
                <li key={n.k} className={i === node ? 'rh-node rh-node--on' : 'rh-node'}>
                  <button type="button" className="rh-node-btn" onClick={() => setNode(i)} aria-expanded={i === node}>
                    <span className="rh-node-dot" aria-hidden="true"><span className="text-xs-semibold">{i + 1}</span></span>
                    <span className="rh-node-k text-xs-semibold">{n.k}</span>
                    <span className="rh-node-v text-md-semibold">{n.v}</span>
                  </button>
                  <a className="rh-node-go text-sm-semibold" href={n.href}>{n.go} →</a>
                </li>
              ))}
            </ol>
            <Details DS={DS} label="The establishment steps, in order, and the source">
              <ol className="rh-pathlist">
                {selected.steps.map((st, i) => (
                  <li key={st.title} className="rh-pathitem rh-pathitem--on">
                    <span className="text-xs-medium rh-eyebrow">Step {i + 1}</span>
                    <span className="text-md-semibold rh-strong">{st.title}</span>
                    <span className="text-sm-regular rh-muted">{st.description}</span>
                  </li>
                ))}
              </ol>
              <SourceLine DS={DS} p={selected.provenance} />
            </Details>
            <div className="rh-actions">
              <DS.Button hierarchy="primary" size="md" href={`/how-to-invest/set-up?${contextQuery(ctx, { route: selected.id })}`} iconTrailing="arrow-right">{selected.startLabel}</DS.Button>
              <DS.Button hierarchy="secondary-gray" size="md" href={`/how-to-invest/incentives?${contextQuery(ctx, { route: selected.id })}`} iconLeading="coins-stacked-01">Review incentives</DS.Button>
              <DS.Button hierarchy="secondary-gray" size="md" href={`/opportunities?${contextQuery(ctx, { route: selected.id })}`} iconLeading="search-lg">Opportunities</DS.Button>
            </div>
          </div>
          <aside className="rh-path-side">
            <div className="rh-path-map">
              <CoastMap pins={pins} active="fit" size={520} tone="light" />
              <span className="rh-path-map-cap text-xs-regular">Lit: the {fitting.length} location{fitting.length === 1 ? '' : 's'} that fit this model. Grey: the rest.</span>
            </div>
            <figure className="rh-path-photo"><img src={ROUTE_PHOTOS[selected.id].src} alt={ROUTE_PHOTOS[selected.id].alt} loading="lazy" /></figure>
          </aside>
        </div>
      </div>
    </section>
  );
}
