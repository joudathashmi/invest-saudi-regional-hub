'use client';

import * as React from 'react';
import type { DS } from '@/lib/ds';
import { INDUSTRIES, MARKETS, ROUTES, type RouteId } from '@/data/regional-hub';
import { marketNames, type HubContext } from './shared';

/**
 * The regional case builder as a guided three-step panel (SlideoutMenu),
 * opened from the hero, the persistent button, and contextual links. Same
 * three inputs and the same shared context as before; the page reads it
 * everywhere. The strip below the hero shows the current case and reopens it.
 */
export function CaseBuilderPanel({ DS, ctx, onChange, open, onClose }: { DS: DS; ctx: HubContext; onChange: (c: HubContext) => void; open: boolean; onClose: () => void }) {
  const [step, setStep] = React.useState(0);
  const groups = Array.from(new Set(MARKETS.map((m) => m.group)));
  const toggleMarket = (code: string) => onChange({ ...ctx, markets: ctx.markets.includes(code) ? ctx.markets.filter((c) => c !== code) : [...ctx.markets, code] });
  if (!open) return null;

  return (
    <DS.SlideoutMenu
      title="Build your regional case"
      description="Three choices shape every section of this page and travel with you to the advisor."
      open
      width={560}
      onClose={onClose}
      actions={
        <>
          <DS.Button hierarchy="secondary-gray" size="md" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </DS.Button>
          {step < 2 ? (
            <DS.Button hierarchy="primary" size="md" iconTrailing="arrow-right" onClick={() => setStep(step + 1)}>
              Next
            </DS.Button>
          ) : (
            <DS.Button hierarchy="primary" size="md" iconTrailing="arrow-right" onClick={onClose}>
              See my regional case
            </DS.Button>
          )}
        </>
      }
    >
      <div className="rh-stack" style={{ gap: 'var(--spacing-3xl)' }}>
        <DS.ProgressSteps steps={['Industry', 'Markets', 'How you operate']} current={step} />
        {step === 0 && (
          <div className="rh-stack" style={{ gap: 'var(--spacing-md)' }}>
            <span className="text-lg-semibold">Which industry are you in?</span>
            <div className="rh-chips">
              {INDUSTRIES.map((i) => (
                <DS.Chip key={i} size="lg" selected={ctx.industry === i} onClick={() => onChange({ ...ctx, industry: ctx.industry === i ? null : i })}>
                  {i}
                </DS.Chip>
              ))}
            </div>
            <span className="text-xs-regular rh-tertiary">Industry list to be replaced by the published controlled vocabulary.</span>
          </div>
        )}
        {step === 1 && (
          <div className="rh-stack" style={{ gap: 'var(--spacing-xl)' }}>
            <span className="text-lg-semibold">Which markets do you want to serve from Saudi Arabia?</span>
            {groups.map((g) => (
              <div key={g} className="rh-stack" style={{ gap: 'var(--spacing-sm)' }}>
                <span className="text-xs-medium rh-tertiary">{g}</span>
                <div className="rh-chips">
                  {MARKETS.filter((m) => m.group === g).map((m) => (
                    <DS.Chip key={m.code} size="md" checkbox selected={ctx.markets.includes(m.code)} onClick={() => toggleMarket(m.code)}>
                      {m.name}
                    </DS.Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="rh-stack" style={{ gap: 'var(--spacing-md)' }}>
            <span className="text-lg-semibold">How do you want to operate from here?</span>
            <div className="rh-stack" style={{ gap: 'var(--spacing-md)' }}>
              {ROUTES.map((r) => (
                <DS.CheckboxCard key={r.id} type="radio" name="route-panel" icon={r.icon} title={r.title} description={r.description} checked={ctx.route === r.id} onChange={() => onChange({ ...ctx, route: r.id as RouteId })} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DS.SlideoutMenu>
  );
}

/** Slim strip under the hero: the current case in one line, with an edit control. */
export function CaseStrip({ DS, ctx, onEdit }: { DS: DS; ctx: HubContext; onEdit: () => void }) {
  const route = ROUTES.find((r) => r.id === ctx.route)?.title;
  const empty = !ctx.industry && !ctx.markets.length && !ctx.route;
  return (
    <div className="rh-case-strip">
      <div className="rh-container rh-case-strip-in">
        <span className="text-sm-medium rh-muted">Your regional case</span>
        <span className="text-sm-regular rh-case-text">
          {empty ? 'Not set. The page shows the whole region until you choose an industry, your markets and how you want to operate.' : [ctx.industry, ctx.markets.length ? marketNames(ctx.markets) : null, route].filter(Boolean).join(' · ')}
        </span>
        <DS.Button hierarchy="link-color" size="sm" iconTrailing="arrow-right" onClick={onEdit}>
          {empty ? 'Build it' : 'Change'}
        </DS.Button>
      </div>
    </div>
  );
}

/** Persistent entry point, bottom corner, after the hero has scrolled away. */
export function CaseFab({ DS, onOpen, visible }: { DS: DS; onOpen: () => void; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="rh-fab">
      <DS.Button hierarchy="primary" size="md" iconLeading="bookmark" onClick={onOpen}>
        My regional case
      </DS.Button>
    </div>
  );
}
