'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { FAQ_ITEMS, ROUTES } from '@/data/regional-hub';
import { Reveal, marketNames, type HubContext } from './shared';

/**
 * 11 Act. Three next steps as photo cards (advisor, incentives, zones), the
 * case summary that travels with the request, then the FAQ and the sideways links.
 */
export function ContinueBand({ DS, ctx, onEditCase }: { DS: DS; ctx: HubContext; onEditCase: () => void }) {
  const [faq, setFaq] = React.useState(false);
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;
  const summary = [ctx.industry, routeTitle, ctx.markets.length ? marketNames(ctx.markets) : null].filter(Boolean).join(' · ');
  const query = new URLSearchParams({ page: 'regional-hub', ...(ctx.industry ? { industry: ctx.industry } : {}), ...(ctx.route ? { route: ctx.route } : {}), ...(ctx.markets.length ? { markets: ctx.markets.join(',') } : {}) }).toString();
  const STEPS = [
    { img: '/img/meeting.jpg', eyebrow: 'Step 1', title: 'Talk to an advisor', text: summary ? `Your case travels with the request: ${summary}.` : 'Set your industry, markets and route and they travel with your request.', href: `/contact/advisor?${query}`, cta: 'Talk to an advisor', icon: 'message-chat-circle' },
    { img: '/img/office.jpg', eyebrow: 'Step 2', title: 'Check your incentives', text: 'Rule-based eligibility for SEZ, ILBZ, RHQ and sector programmes, confirmed per application.', href: `/how-to-invest/incentives?${query}`, cta: 'Check eligibility', icon: 'coins-stacked-01' },
    { img: '/img/kaec.jpg', eyebrow: 'Step 3', title: 'Choose where to operate', text: 'Zones on both coasts, the Riyadh logistics zone and industrial cities nationwide.', href: '#platforms', cta: 'Explore the zones', icon: 'marker-pin-01' },
  ];
  return (
    <section id="continue" className="rh-band" aria-labelledby="rh-continue">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">10 · Act</span>
          <h2 id="rh-continue" className="display-md-semibold rh-h2">Three steps from here</h2>
          <p className="text-lg-regular rh-muted rh-para">Everything you set on this page goes with you: the advisor, the incentive check and the zone pages all receive your case.</p>
        </Reveal>
        <div className="rh-steps3">
          {STEPS.map((s) => (
            <a key={s.title} className="rh-step3" href={s.href}>
              <img src={s.img} alt="" aria-hidden="true" loading="lazy" />
              <span className="rh-step3-text">
                <span className="text-xs-semibold rh-eyebrow">{s.eyebrow}</span>
                <span className="display-xs-semibold">{s.title}</span>
                <span className="text-sm-regular">{s.text}</span>
                <span className="rh-step3-cta text-sm-semibold"><DS.Icon name={s.icon} size={16} /> {s.cta}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="rh-actions">
          <DS.Button hierarchy="secondary-color" size="md" iconLeading="bookmark" onClick={onEditCase}>Edit my regional case</DS.Button>
          <DS.Button hierarchy="secondary-gray" size="md" href="#" iconLeading="bookmark">Save to My Space</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/why-saudi" iconLeading="arrow-left">Why Saudi</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/sectors">Sectors</DS.Button>
          <DS.Button hierarchy="link-gray" size="md" href="/opportunities">Opportunities</DS.Button>
        </div>
        <div className="rh-actions"><DS.Button hierarchy="link-gray" size="md" iconLeading={faq ? 'chevron-up' : 'help-circle'} onClick={() => setFaq(!faq)}>{faq ? 'Hide questions' : 'Questions investors ask'}</DS.Button></div>
        {faq && <DS.FAQ items={FAQ_ITEMS} firstOpen />}
      </div>
    </section>
  );
}
