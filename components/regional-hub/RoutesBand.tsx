'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { PLATFORMS, ROUTES, type RouteId } from '@/data/regional-hub';
import { contextQuery } from '@/lib/copilot-context';
import { Details, Reveal, Sideways, SourceLine, type HubContext } from './shared';
import { ROUTE_PHOTOS } from './imagery';

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
    <section id="routes" className="rh-band rh-glow-r" aria-labelledby="rh-routes">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">05 · Operating routes</span>
          <h2 id="rh-routes" className="display-md-semibold rh-h2">How you can run the region from here</h2>
          <p className="text-lg-regular rh-muted rh-para">Five ways to run the region from here; a regional headquarters is one of them. Your choice highlights what matters elsewhere on the page.</p>
        </Reveal>
        <DS.Tabs
          type="underline"
          items={ROUTES.map((r) => ({ label: r.title.replace(' (Regional Headquarters)', ''), value: r.id }))}
          value={selected.id}
          onChange={(v: string) => onChange({ ...ctx, route: v as RouteId })}
        />
        <div className="rh-explorer">
          <div className="rh-q">
            <span className="rh-q-n text-xs-semibold">1</span>
            <div className="rh-q-body">
              <h3 className="display-xs-semibold rh-h3">What can I establish?</h3>
              <div className="rh-route-head"><DS.FeaturedIcon icon={selected.icon} color="brand" size="lg" /><div><span className="text-lg-semibold rh-strong">{selected.title}</span><p className="text-md-regular rh-muted rh-para">{selected.description}</p></div></div>
            </div>
          </div>
          <div className="rh-q">
            <span className="rh-q-n text-xs-semibold">2</span>
            <div className="rh-q-body">
              <h3 className="display-xs-semibold rh-h3">Why establish it in Saudi Arabia?</h3>
              <p className="text-md-regular rh-para">{selected.meta}. {selected.connectivity}</p>
            </div>
          </div>
          <div className="rh-q">
            <span className="rh-q-n text-xs-semibold">3</span>
            <div className="rh-q-body">
              <h3 className="display-xs-semibold rh-h3">What would I need?</h3>
              <dl className="rh-needs">
                <div><dt className="text-xs-semibold rh-eyebrow">Locations</dt><dd className="text-sm-regular">{PLATFORMS.filter((p) => p.routes.includes(selected.id)).map((p) => p.name).join(', ') || 'Any licensed premises'} <a className="rh-inline-link" href="#platforms">See locations →</a></dd></div>
                <div><dt className="text-xs-semibold rh-eyebrow">Licence</dt><dd className="text-sm-regular">{selected.licence}.</dd></div>
                <div><dt className="text-xs-semibold rh-eyebrow">Incentives</dt><dd className="text-sm-regular">{selected.incentives[0]}</dd></div>
                <div><dt className="text-xs-semibold rh-eyebrow">Shared frameworks</dt><dd className="text-sm-regular">{selected.id === 'export' || selected.id === 'logistics' ? 'GCC customs union and GAFTA rules of origin for goods.' : 'National licensing in each market; tax treaties where in force.'} <a className="rh-inline-link" href="#market-access">See frameworks →</a></dd></div>
                <div><dt className="text-xs-semibold rh-eyebrow">People</dt><dd className="text-sm-regular">Residency routes and Saudization terms per programme. <a className="rh-inline-link" href="#talent">See talent →</a></dd></div>
              </dl>
              <Details DS={DS} label="The establishment steps, in order">
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
              </Details>
            </div>
          </div>
          <div className="rh-q">
            <span className="rh-q-n text-xs-semibold">4</span>
            <div className="rh-q-body">
              <h3 className="display-xs-semibold rh-h3">What should I do next?</h3>
              <div className="rh-actions">
                <DS.Button hierarchy="primary" size="md" href={`/how-to-invest/set-up?${contextQuery(ctx, { route: selected.id })}`} iconTrailing="arrow-right">{selected.startLabel}</DS.Button>
                <DS.Button hierarchy="secondary-gray" size="md" href={`/how-to-invest/incentives?${contextQuery(ctx, { route: selected.id })}`} iconLeading="coins-stacked-01">Review incentives</DS.Button>
                <DS.Button hierarchy="secondary-gray" size="md" href={`/opportunities?${contextQuery(ctx, { route: selected.id })}`} iconLeading="search-lg">Opportunities</DS.Button>
              </div>

            </div>
          </div>
          <aside className="rh-route-path">
            <img key={selected.id} className="rh-route-photo" src={ROUTE_PHOTOS[selected.id].src} alt={ROUTE_PHOTOS[selected.id].alt} loading="lazy" />
            <span className="text-sm-semibold rh-eyebrow">The path, in order</span>
            <DS.ProgressSteps steps={selected.steps} current={current} />
          </aside>
        </div>
      </div>
    </section>
  );
}
