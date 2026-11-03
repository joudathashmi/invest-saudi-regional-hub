'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { ROUTES, type RouteId } from '@/data/regional-hub';
import { Reveal, Sideways, SourceLine, type HubContext } from './shared';

/**
 * Evaluate. Five ways to run the region from here, as tabs with the path drawn
 * as steps. The selection is the same shared context the case builder sets.
 */
export function RoutesBand({ DS, ctx, onChange }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void }) {
  const selected = ROUTES.find((r) => r.id === ctx.route) ?? ROUTES[0];
  const [current, setCurrent] = React.useState(0);
  const refs = React.useRef<(HTMLLIElement | null)[]>([]);
  React.useEffect(() => {
    setCurrent(0);
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const i = Number(e.target.getAttribute('data-i')); setCurrent((c) => Math.max(c, i)); }
    }, { rootMargin: '0px 0px -40% 0px', threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selected.id]);

  return (
    <section id="routes" className="rh-band" aria-labelledby="rh-routes">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">Evaluate</span>
          <h2 id="rh-routes" className="display-md-semibold rh-h2">How you can run the region from here</h2>
          <p className="text-lg-regular rh-muted rh-para">Five routes, each with its licence, the incentives that may apply, the connectivity it depends on, and the order of steps. A regional headquarters is one of the five, not the only one.</p>
        </Reveal>
        <DS.Tabs
          type="underline"
          items={ROUTES.map((r) => ({ label: r.title.replace(' (Regional Headquarters)', ''), value: r.id }))}
          value={selected.id}
          onChange={(v: string) => onChange({ ...ctx, route: v as RouteId })}
        />
        <div className="rh-route">
          <div className="rh-route-text">
            <div className="rh-route-head">
              <DS.FeaturedIcon icon={selected.icon} color="brand" size="lg" />
              <div>
                <h3 className="display-xs-semibold rh-h3">{selected.title}</h3>
                <p className="text-md-regular rh-muted rh-para">{selected.description}</p>
              </div>
            </div>
            <p className="text-md-regular rh-para"><span className="rh-strong">Licence.</span> {selected.licence}.</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">Incentives.</span> {selected.incentives[0]}</p>
            <p className="text-md-regular rh-para"><span className="rh-strong">Connectivity that matters.</span> {selected.connectivity}</p>
            <ol className="rh-pathlist">
              {selected.steps.map((st, i) => (
                <li key={st.title} data-i={i} ref={(el) => { refs.current[i] = el; }} className={i <= current ? 'rh-pathitem rh-pathitem--on' : 'rh-pathitem'}>
                  <span className="text-xs-medium rh-eyebrow">Step {i + 1}</span>
                  <span className="text-md-semibold rh-strong">{st.title}</span>
                  <span className="text-sm-regular rh-muted">{st.description}</span>
                </li>
              ))}
            </ol>
            <SourceLine DS={DS} p={selected.provenance} />
            <div className="rh-actions">
              <DS.Button hierarchy="primary" size="md" href={selected.startHref} iconTrailing="arrow-right">
                {selected.startLabel}
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="md" href={`/how-to-invest/incentives?route=${selected.id}`} iconLeading="coins-stacked-01">
                Find incentives for this route
              </DS.Button>
            </div>
            <Sideways
              DS={DS}
              items={[
                { label: 'Platforms for this route', href: '#platforms', icon: 'marker-pin-01' },
                { label: 'Who already does this', href: '#companies', icon: 'users-01' },
                { label: 'Compare hubs for this route', href: '#comparison', icon: 'scale-01' },
              ]}
            />
          </div>
          <div className="rh-route-path">
            <span className="text-sm-semibold rh-eyebrow">The path, in order</span>
            <DS.ProgressSteps steps={selected.steps} current={current} />
          </div>
        </div>
      </div>
    </section>
  );
}
