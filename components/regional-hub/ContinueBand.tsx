'use client';

import type { DS } from '@/lib/ds';
import { FAQ_ITEMS, ROUTES, TALENT_FIGURES } from '@/data/regional-hub';
import { Reveal, SourceLine, marketNames, type HubContext } from './shared';

/**
 * Band 10: talent, living and continue. Talk to an advisor with the declared
 * context attached, the FAQ, and the circle-back links so the page never ends
 * in a dead end.
 */
export function ContinueBand({ DS, ctx, onEditCase }: { DS: DS; ctx: HubContext; onEditCase: () => void }) {
  const routeTitle = ctx.route ? ROUTES.find((r) => r.id === ctx.route)?.title : null;
  const summary = [ctx.industry, routeTitle, ctx.markets.length ? marketNames(ctx.markets) : null].filter(Boolean).join(' · ');
  const query = new URLSearchParams({
    page: 'regional-hub',
    ...(ctx.industry ? { industry: ctx.industry } : {}),
    ...(ctx.route ? { route: ctx.route } : {}),
    ...(ctx.markets.length ? { markets: ctx.markets.join(',') } : {}),
  }).toString();

  return (
    <section id="continue" className="rh-band" aria-labelledby="rh-continue">
      <div className="rh-container rh-stack">
        <Reveal className="rh-editorial-lead">
          <span className="text-sm-semibold rh-eyebrow">09 · Act</span>
          <h2 className="display-md-semibold rh-h2">Talent, living and next steps</h2>
          <p className="text-lg-regular rh-muted rh-para">Regional talent mobility, relocation and living in Saudi Arabia sit on their own pages. From here you can talk to an advisor with your case already attached.</p>
        </Reveal>
        <dl className="rh-statline">
          {TALENT_FIGURES.map((f) => (
            <div key={f.label} className="rh-stat">
              <dt className="display-xs-semibold">{f.value}</dt>
              <dd className="text-sm-regular rh-muted">{f.label}<br /><SourceLine DS={DS} p={f} /></dd>
            </div>
          ))}
        </dl>
        <div className="rh-grid rh-grid--2">
          <DS.InlineCTA
            title="Talk to an investment advisor"
            text={summary ? `Your case: ${summary}. The advisor receives this context with your request.` : 'Set your industry, markets and route above and they travel with your request.'}
            actions={
              <DS.Button hierarchy="primary" size="md" href={`/contact/advisor?${query}`} iconLeading="message-chat-circle">
                Talk to an advisor
              </DS.Button>
            }
          />
          <div className="rh-card">
            <DS.CardHeader title="Related pages" supporting="Continue sideways rather than back to the top." />
            <div className="rh-actions">
              <DS.Button hierarchy="secondary-color" size="sm" iconLeading="bookmark" onClick={onEditCase}>
                Edit my regional case
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="#" iconLeading="bookmark">
                Save to My Space
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="/why-saudi/talent" iconLeading="users-01">
                Talent and relocation
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="/why-saudi/living" iconLeading="globe-01">
                Living in Saudi Arabia
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="/sectors" iconLeading="briefcase-01">
                Sectors
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="/opportunities" iconLeading="coins-stacked-01">
                Opportunities
              </DS.Button>
              <DS.Button hierarchy="secondary-gray" size="sm" href="/why-saudi" iconLeading="arrow-left">
                Why Saudi
              </DS.Button>
            </div>
          </div>
        </div>
        <h3 className="display-xs-semibold rh-h3">Questions investors ask</h3>
        <DS.FAQ items={FAQ_ITEMS} firstOpen />
      </div>
    </section>
  );
}
